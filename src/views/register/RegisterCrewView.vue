<template>
    <div class="c-auth-page">
        <form class="center-form" @submit.prevent="singup">
            <div class="mb-3">
                <h3 class="text-center">
                    Health Syetem Service
                </h3>
                <img class="logo" src="@/assets/logo.png" alt="">
                <h4 class="text-center">
                    Sign Up as Crew Member
                </h4>
            </div>



            <div class="mb-3">
                <label for="type">Select Member Type</label>
                <select class="form-control" id="type" v-model="type">
                    <option value="">--Select Type--</option>
                    <option value="doctors">Doctor</option>
                    <option value="assistants">Assistant</option>
                    <!-- <option value="owners">Owner</option> -->
                </select>
            </div>

            <div class="mb-3">
                <label for="name">Name</label>
                <input type="text" id="name" class="form-control" placeholder="Name" required v-model="name">
            </div>
            <div class="mb-3">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email" class="form-control" v-model="email">

            </div>
            <div class="mb-3">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password" class="form-control" v-model="password">
            </div>

            <div class="mb-3">
                <button class="btn btn-primary w-100">
                    Sign Up
                </button>
            </div>

            <div class="mb-3">
                <a href="/crew/singin" class="btn btn-outline-primary w-100">Already have account?</a>
            </div>

        </form>
    </div>
</template>

<script>
import router from "@/router";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, onSnapshot, doc, query, where, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
    name: "CrewRegister",
    data() {
        return {
            type: "",
            name: "",
            email: "",
            password: "",
        }
    },
    methods: {
        async singup() {
            let obj = {
                name: this.name,
                email: this.email,
                password: this.password
            }

            console.log(type.value)

            switch (type.value) {
                case "doctors":
                    this.registerDoctor(obj).then((r) => {
                        setInterval(() => {
                            router.push("/dashboard")
                        }, 2000)

                    })



                    break
                case "assistants":
                    this.registerAsisstant(obj)
                        .then((r) => {
                            setInterval(() => {
                                router.push("/dashboard")
                            }, 2000)

                        })

                    break
                case "owners":
                    this.registerOwner(obj)
                        .then((r) => {
                            setInterval(() => {
                                router.push("/dashboard")
                            }, 2000)

                        })
                    break
                default:
                    console.log("Unknown type")

            }
        },

        async registerDoctor(obj) {
            let errObj = {
                gotErr: false,
                msg: ""
            };
            createUserWithEmailAndPassword(getAuth(), obj.email, obj.password)
                .then(async (data) => {
                    console.log(data);
                    console.log("successfull registration!");
                    //   router.push("/dashboard");
                    let currentUser = getAuth().currentUser;
                    console.log("🤠🩺", currentUser.uid);

                    const docRef = await addDoc(collection(db, "doctors"), {
                        name: obj.name,
                        email: obj.email,
                        uuid: currentUser.uid,
                        phoneNumber: "",
                        licenseNumber: "",
                        profile_pic: "",
                        assistants:[]
                    });

                    await addDoc(collection(db, "users"), {
                        type: "doctors",
                        id: currentUser.uid,
                        docRef: docRef.id,
                    });

                    console.log("addDoc: " + docRef.id);
                })
                .catch((err) => {
                    errObj.gotErr = true
                    console.log(err);
                    switch (err.code) {
                        case "auth/email-already-exists":
                            errObj.msg = "Email already exists";
                        default:
                            errObj.msg = "";
                    }
                });

            return errObj;
        },
        async registerAsisstant(obj) {

            let errObj = {
                gotErr: false,
                msg: ""
            };
            createUserWithEmailAndPassword(getAuth(), obj.email, obj.password)
                .then(async (data) => {
                    console.log(data);
                    console.log("successfull registration!");
                    //   router.push("/dashboard");
                    let currentUser = getAuth().currentUser;
                    console.log("🤠😷", currentUser.uid);

                    const docRef = await addDoc(collection(db, "assistants"), {
                        name: obj.name,
                        email: obj.email,
                        uuid: currentUser.uid,
                        phone: "",
                        profile_pic: ""
                    });

                    await addDoc(collection(db, "users"), {
                        type: "assistants",
                        id: currentUser.uid,
                        docRef: docRef.id,
                    });

                    console.log("addDoc: " + docRef.id);
                })
                .catch((err) => {
                    errObj.gotErr = true
                    console.log(err);
                    switch (err.code) {
                        case "auth/email-already-exists":
                            errObj.msg = "Email already exists";
                        default:
                            errObj.msg = "";
                    }
                });

            return errObj;

        },
        async registerOwner(obj) {



            let errObj = {
                gotErr: false,
                msg: ""
            };
            createUserWithEmailAndPassword(getAuth(), obj.email, obj.password)
                .then(async (data) => {
                    console.log(data);
                    console.log("successfull registration!");
                    //   router.push("/dashboard");
                    let currentUser = getAuth().currentUser;
                    console.log("🤠👨‍💼", currentUser.uid);

                    const docRef = await addDoc(collection(db, "owners"), {
                        name: obj.name,
                        email: obj.email,
                        uuid: currentUser.uid
                    });

                    await addDoc(collection(db, "users"), {
                        type: "owners",
                        id: currentUser.uid,
                        docRef: docRef.id,
                    });

                    console.log("addDoc: " + docRef.id);
                })
                .catch((err) => {
                    errObj.gotErr = true
                    console.log(err);
                    switch (err.code) {
                        case "auth/email-already-exists":
                            errObj.msg = "Email already exists";
                        default:
                            errObj.msg = "";
                    }
                });

            return errObj;

        }


    }
}






</script>