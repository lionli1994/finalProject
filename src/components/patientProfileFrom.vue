<template>
    <div class="row">
        <div class="col-md-12">


            <div class="mb-3">
                <label for="name">Name</label>
                <input v-model="name" type="text" id="name" class="form-control" placeholder="Name" required>
            </div>
            <div class="mb-3">
                <label for="email">Email</label>
                <input type="email" class="form-control" readonly id="email" v-model="email">
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

            <div class="mb">
                <div class="row d-flex ">
                    <button class="ms-auto btn btn-primary" style="width:200px" @click="save">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, getDcos, doc, query, where, addDoc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase"
export default {

    data() {
        return {
            name: "",
            email: "",
            bday: "",
            gender: "",
            id:""
        }
    },
    mounted() {
        let auth = getAuth();

        const q = query(collection(db, "patients"), where("uuid", "==", auth.currentUser.uid))

        onSnapshot(q, (snap) => {
            snap.docs.forEach((doc) => {
                let docData = doc.data()
                this.name = docData.name
                this.email = docData.email
                this.gender = docData.gender
                this.bday = docData.bday
            })
        })


        

    },
    methods: {
        async save() {

            const q = query(collection(db, "patients"), where("uuid", "==", getAuth().currentUser.uid))
            await getDocs(q).then(docData => {
                docData.docs.forEach(d => {
                    this.id = d.id
                })
            })

            const doctor = doc(db, "patients", this.id)
            await updateDoc(doctor, {
                name: this.name,
                gender: this.gender,
                bday: this.bday
            }).then(() => {
                this.$toast.success("profile update successfully")
            })
        }
    }

}
</script>

<style>
</style>