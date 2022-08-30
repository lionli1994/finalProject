<template>
    <div class="container">

        <div class="row " style="margin-top:50px">
            <a href="/dashboard" class="btn btn-secondary mb-3" style="width:100px">Back</a>
            <h3>My Appointments</h3>
            <hr>
            <div class="col-md-12">
                <div v-for="(item, index) in appointments" :key="index">
                    <PatientAppoCard :item="item" @openInbox="openInbox" @cancel="cancel"></PatientAppoCard>
                </div>
            </div>
        </div>

        <ChatView v-if="chatRoomId != ''" :class_="chatbox" @closeChat="closeChat" :roomId="chatRoomId"
            :title="ChatRoomTitle" :currentUserType="currentUserType"></ChatView>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, limit, startAt, orderBy, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"
import PatientAppoCard from "@/components/patientAppoCard.vue";
import ChatView from "@/components/ChatView.vue"
export default {
    data() {
        return {
            appointments: [],
            chatbox: "chat-box-hide",
            chatRoomId: "",
            ChatRoomTitle: "",
            currentUserType: "patients"

        }
    },
    methods: {
        async cancel(id) {
            if (confirm("Are you sure you want to cancel this")) {
                const a = doc(db, "appointments", id)
                updateDoc(a, {
                    status: "cancel"
                }).then(() => {
                    this.$toast.success("appointment cancel successfully")
                })
            }

        },
        async openInbox(id, title) {
            this.chatRoomId = id;
            this.ChatRoomTitle = title;
            this.chatbox = "chat-box"

            const q = query(collection(db, "chats"), where("roomId", "==", id), where("isRead", "==", false), where("who", "!=", "patients"))
            const docs = await getDocs(q)
            // console.log(docs)
            docs.docs.forEach(async chatRow => {
                let row = doc(db, "chats", chatRow.id)
                updateDoc(row, {
                    isRead: true
                })
            })

        },
        closeChat() {
            this.chatbox = "chat-box-hide"
        }
    },
    components: {
        PatientAppoCard,
        ChatView

    }
    ,
    mounted() {
        const q = query(collection(db, "appointments"), where("patientId", "==", getAuth().currentUser.uid), where("status", "!=", "cancel"), orderBy("status"), orderBy("createAt"))
        onSnapshot(q, (snap) => {
            this.appointments = []
            snap.docs.forEach(doc => {
                // console.log(doc.id)
                let item = {
                    id: doc.id,
                    doctorName: doc.data().doctorName,
                    date: doc.data().date,
                    method: doc.data().method,
                    status: doc.data().status,
                    time: doc.data().time,
                }
                console.log(doc.data().time)

                this.appointments.push(item)
            })
        })
    }

}
</script>

<style>
</style>