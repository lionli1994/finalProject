<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <!-- <form> -->
          <div class="mb-3">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" v-model="name">
          </div>
          <div class="mb-3">
            <label for="email">Email</label>
            <input type="email" class="form-control" readonly id="email" v-model="email">
          </div>
          <div class="mb-3">
            <label for="telephone">Telephone</label>
            <input type="text" class="form-control" id="telephone" v-model="telephone">
          </div>
          <div class="mb-3">
            <label for="licenseNumber">License Number</label>
            <input type="text" class="form-control" id="licenseNumber" v-model="licenseNumber">
          </div>

          <div class="mb-3">
            <label for="expretise">Expretise</label>
            <div id="expretise">
              <ul class="list-group list-group-flush mb-3">
                <li v-for="(item, index) in expreties" :key="index" class="list-group-item">
                  {{ item.name }}
                  <div class="btn btn-danger btn-sm ms-2" @click="deleteExpreties(item.id)">Delete</div>
                </li>
              </ul>
              <div class="d-flex">
                <input type="text" class="form-control" placeholder="New expretise" v-model="newExpreties">
                <div style="width:200px" class="ms-2 btn btn-primary" @click="addNewExpreties">Add New</div>

              </div>
            </div>
          </div>

          <div class="mb-3 d-flex">
            <button class="btn btn-primary ms-auto" style="width:200px" @click="save">Save</button>
          </div> 

        <!-- </form> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot,getDcos, doc, query, where, addDoc, deleteDoc,updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase"
export default {
  name: "DoctorProfileFormVue",
  data() {
    return {
      name: "",
      email: "",
      telephone: "",
      licenseNumber: "",
      expreties: [],
      newExpreties: "",
      id:""
    }
  },
  mounted() {
    let auth = getAuth();

    const q = query(collection(db, "doctors"), where("uuid", "==", auth.currentUser.uid))

    onSnapshot(q, (snap) => {
      snap.docs.forEach((doc) => {
        let docData = doc.data()
        this.name = docData.name
        this.email = docData.email
        this.telephone = docData.phoneNumber
        this.licenseNumber = docData.licenseNumber
      })
    })

    this.refreshExpreties()

  },

  methods: {
    async save(){
      
      const q = query(collection(db, "doctors"),where("uuid","==",getAuth().currentUser.uid))
      await getDocs(q).then(docData =>{
        docData.docs.forEach(d=>{
          this.id = d.id
        })
      })

      const doctor = doc(db,"doctors",this.id)
      await updateDoc(doctor,{
        name:this.name,
        phoneNumber:this.telephone,
        licenseNumber:this.licenseNumber
      }).then(() => {
        this.$toast.success("profile update successfully")
      })
    },

    refreshExpreties() {
      this.newExpreties = ""
      const ex = query(collection(db, "expretise"), where("doctorId", "==", getAuth().currentUser.uid))

      onSnapshot(ex, (snap) => {
        this.expreties = []
        snap.docs.forEach((doc) => {
          console.log(doc.id)
          let docData = {
            "id": doc.id,
            "name": doc.data().name,
            "doctorId": doc.data().doctorId,
          }
          this.expreties.push(docData)
        })
      })

    },

    addNewExpreties() {
      addDoc(collection(db, "expretise"), {
        name: this.newExpreties,
        doctorId: getAuth().currentUser.uid
      }).then(() => {
        this.refreshExpreties()
      })
    },
    deleteExpreties(doctorId) {
      console.log(doctorId)
      deleteDoc(doc(db, "expretise", doctorId)).then(() => {
        this.refreshExpreties()
      })

    }
  }


}
</script>

<style>
</style>