<template>

    <div class="p-auth-page">
        <div class="center-form" id="">
            <div class="mb-3">
                <h3 class="text-center">
                    Health Syetem Service
                </h3>
                <img class="logo" src="@/assets/logo.png" alt="">
                <h4 class="text-center">
                    Sign In as Patient
                </h4>
            </div>

            <div class="mb-3" v-if="errMsg != ''">
                <div class="alert alert-danger">
                    {{ errMsg }}
                </div>
            </div>

            <!-- email  -->

            <div class="mb-3">
                <label for="email">E-mail</label>
                <input v-model="email" type="email" class="form-control" id="email" placeholder="example@example.com">

            </div>
            <div class="mb-4">
                <label for="password">Password</label>
                <input v-model="password" type="password" class="form-control" id="password">
            </div>
            <div class="mb-3">
                <button @click="login" class="btn btn-primary w-100">
                    Sign In
                </button>
            </div>
            <div class="mb-3">
                <a href="/register/patient" class="btn btn-outline-primary  w-100">Sign Up </a>
            </div>

            <hr>
            <div class="mb-3">
                <a href="/crew/singin" class="btn btn-outline-secondary w-100">Sing In As Crew Member</a>
            </div>



        </div>
    </div>

</template>

<script>

import router from "@/router";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { collection, onSnapshot, documentId, doc, query, where, addDoc } from "firebase/firestore";
import { db } from "@/firebase"



export default {
    name: "LoginPatient",
    data() {
        return {
            email: "",
            password: "",
            errMsg: ""
        }
    },
    methods: {
        async login() {
            
            signInWithEmailAndPassword(getAuth(), this.email, this.password)
                .then(async (data) => {
                    console.log(getAuth().currentUser.uid)
                    // console.log("successfull Login")
                    let col = collection(db, "users")
                    let q = query(col, where("id", "==", getAuth().currentUser.uid))
                    onSnapshot(q, (snap) => {
                        snap.docs.forEach((doc) => {
                            console.log("🧪", doc.data())
                            if (doc.data().type == "patients") {
                                router.push("/dashboard")
                            } else {
                                signOut(getAuth()).then(() => {
                                    router.push("/")
                                })
                            }

                        })
                    })

                })
                .catch((err) => {
                    console.log(err)
                    switch (err.code) {
                        case "auth/wrong-password":
                            errMsg = "wrong password"
                            break
                        case "auth/invalid-email":
                            errMsg = "invalid email"
                            break
                        case "auth/user-not-found":
                            errMsg = "user not found"
                            break
                        case "auth/user-disabled":
                            errMsg = "user disabled"
                            break
                        default:
                            console.log("no err")
                    }
                })
            console.log("login")
        }
    }
}

</script>