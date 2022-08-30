<template>
    <div>
        <div class="container py-4">
            <a href="/dashboard" class="btn btn-secondary mb-3">Back</a>
            <h1>Profile Info</h1>

            <DoctorProfileFormVue v-if="userType == 'doctors'"></DoctorProfileFormVue>

            <PatientProfileFrom v-if="userType == 'patients'"></PatientProfileFrom>

            <AssistantsProfileform v-if="userType == 'assistants'"></AssistantsProfileform>

            <hr>
            <h1>Change Password</h1>
            <div>

                <div class="mb-3">
                    <p style="color:red"> Please check spam folder in your email</p>
                    <button class="btn btn-primary" @click="sendCode">
                        Send Reset Link
                    </button>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, } from "firebase/firestore";
import { db } from "@/firebase"
import DoctorProfileFormVue from "@/components/DoctorProfileForm.vue";
import PatientProfileFrom from "@/components/patientProfileFrom.vue";
import AssistantsProfileform from "@/components/assistantsProfileform.vue";
export default {
    name: "ProfileView",
    data() {
        return {
            userType: ""
        }
    },
    methods: {
        sendCode() {
            const auth = getAuth();
            sendPasswordResetEmail(auth, auth.currentUser.email)
                .then(() => {
                    // Password reset email sent!
                    // ..
                    this.$toast.success("Password reset email sent!")
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        }
    },
    components: {
    DoctorProfileFormVue,
    PatientProfileFrom,
    AssistantsProfileform
},
    beforeMount() {
        let auth = getAuth();

        const q = query(collection(db, "users"), where("id", "==", auth.currentUser.uid))

        onSnapshot(q, (snap) => {

            snap.docs.forEach((doc) => {
                console.log(doc.data())
                let currentUserData = doc.data()

                switch (currentUserData.type) {
                    case "patients":
                        this.userType = "patients"
                        break

                    case "doctors":
                        this.userType = "doctors"
                        break
                    case "assistants":
                        this.userType = "assistants"
                        break


                    default:

                        console.log("none")
                }
            })
        })
    }
}
</script>

<style>
</style>