<template>
  <div class="p-auth-page">

    <form class="center-form" @submit.prevent="signUp">
      <div class="mb-3">
        <h3 class="text-center">
          Health Syetem Service
        </h3>
        <img class="logo" src="@/assets/logo.png" alt="">
        <h4 class="text-center">
          Sign Up as Patient
        </h4>
      </div>

      <div class="mb-3">
        <label for="name">Name</label>
        <input v-model="name" type="text" id="name" class="form-control" placeholder="Name" required>
      </div>
      <div class="mb-3">
        <label for="bday">Birth Day</label>
        <input v-model="bday" type="date" id="bday" class="form-control" required>
      </div>

      <!-- gender  -->
      <div class="mb-3">
        <label for="Gender">Gender</label>
        <div class="input-group">
          <div class="input-group-text">
            <input id="gender" class="form-check-input mt-0" type="radio" value="Male" v-model="gender"
              aria-label="Checkbox for following text input" /><span class="ms-1"> Male</span>
          </div>
          <div class="input-group-text">
            <input class="form-check-input mt-0" type="radio" value="Female" v-model="gender"
              aria-label="Checkbox for following text input" /><span class="ms-1"> Female</span>
          </div>
        </div>
      </div>

      <!-- email  -->

      <div class="mb-3">
        <label for="email">E-mail</label>
        <input v-model="email" type="email" class="form-control" id="email" placeholder="example@example.com" required>

      </div>
      <div class="mb-4">
        <label for="password">Password</label>
        <input v-model="password" type="password" class="form-control" id="password" required>
      </div>
      <div class="mb-3">
        <button class="btn btn-primary w-100">
          Sign Up
        </button>
      </div>

      <div class="mb-3">
        <a href="/" class="btn btn-outline-primary w-100">Already have account?</a>
      </div>

    </form>
  </div>

</template>

<script>
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";
import { collection, onSnapshot, doc, query, where, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "PatientRegister",
  data() {
    return {
      name: "",
      bday: "",
      gender: "",
      email: "",
      password: ""
    }
  },
  methods: {
    async signUp() {
      let obj = {
        name: this.name,
        bday: this.bday,
        gender: this.gender,
        email: this.email,
        password: this.password

      }
      createUserWithEmailAndPassword(getAuth(), obj.email, obj.password)
        .then(async (data) => {
          console.log(data);
          console.log("successfull registration!");
          //   router.push("/dashboard");
          let currentUser = getAuth().currentUser;
          console.log("🤠", currentUser.uid);

      const docRef = await addDoc(collection(db, "patients"), {
        name: obj.name,
        bday: obj.bday,
        gender: obj.gender,
        email: obj.email,
        uuid: currentUser.uid,
        phone:"",
        profile_pic:""
      });

      await addDoc(collection(db, "users"), {
        type: "patients",
        id: currentUser.uid,
        docRef: docRef.id,
      });

          console.log("addDoc: " + docRef.id);
          router.push("/dashboard");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}



</script>