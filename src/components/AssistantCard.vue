<template>
    <div class="card m-3">
        <img src="@/assets/img/assistant.png" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ data.name }}</h5>
            <p>Telephone : {{ data.phone }}</p>
            <p>Email : {{ data.email }}</p>
            <div class="d-flex" v-if="!isMy">
                <button class="ms-auto me-auto btn btn-primary" @click="addAssistant">Add as Assistant</button>
            </div>
            <div class="d-flex" v-if="isMy">
                <button class="ms-auto me-auto btn btn-primary" @click="$emit('startchat',data.uuid)">Chat</button>
            </div>

        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, getDocs, updateDoc, doc, query, where, Timestamp, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"

export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
        isMy: {
            type: Boolean,
            required: true,
        }
    },
    
    
    mounted(){
        if(this.isMy){
            
        }
    },
    methods: {
        async addAssistant() {
            // console.log(this.data)
            const docotorQ = query(collection(db, "doctors"), where("uuid", "==", getAuth().currentUser.uid))
            const doctors = await getDocs(docotorQ)

            const q = query(collection(db, "doctor_assistant"), where("doctorId", "==", getAuth().currentUser.uid), where("assistantId", "==", this.data.uuid))
            const qDoc = await getDocs(q)
            if (qDoc.docs.length == 0) {
                if (doctors.docs.length == 1) {
                    addDoc(collection(db, "doctor_assistant"), {
                        doctorId: doctors.docs[0].data().uuid,
                        doctorName: doctors.docs[0].data().name,
                        assistantId: this.data.uuid,
                        assistantName: this.data.name,
                    }).then(() => {
                        this.$toast.success("Assistant successfully added")

                    })
                }
            } else {
                this.$toast.warning("Already added!")
            }



        }
    }


}
</script>

<style>
</style>