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
import { collection, onSnapshot, getDcos, doc, query, where, addDoc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase"
export default {
    data() {
        return {
            name: "",
            email: "",
            telephone: "",
            id: ""
        }
    },
    mounted() {
        let auth = getAuth();

        const q = query(collection(db, "assistants"), where("uuid", "==", auth.currentUser.uid))

        onSnapshot(q, (snap) => {
            snap.docs.forEach((doc) => {
                let docData = doc.data()
                this.name = docData.name
                this.email = docData.email
                this.telephone = docData.phone

            })
        })



    },
    methods: {
        async save() {

            const q = query(collection(db, "assistants"), where("uuid", "==", getAuth().currentUser.uid))
            await getDocs(q).then(docData => {
                docData.docs.forEach(d => {
                    this.id = d.id
                })
            })

            const doctor = doc(db, "assistants", this.id)
            await updateDoc(doctor, {
                name: this.name,
                phone: this.telephone,
            }).then(() => {
                this.$toast.success("profile update successfully")
            })
        }
    }
}
</script>

<style>
</style>