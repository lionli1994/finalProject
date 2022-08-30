<template>
    <div class="container">
        <div class="row mt-4">
            <div class="col-md-12">
                <div class="d-flex" v-if="user.type == 'patients'">
                    <button class=" ms-auto btn btn-primary" @click="openPopup">Start chat with new Doctor</button>
                </div>

                <h1>Emergency Chats</h1>
                <ul class="list-group mt-4">
                    <EmergencyCard v-for="(item, index) in chatRooms" :key="index" :user="user" :data="item"
                        @openinbox="openinbox">
                    </EmergencyCard>
                </ul>


            </div>
        </div>


        <DoctorListPopup @startchat="startchat" v-if="canOpenPopup" @close="closePopup"></DoctorListPopup>
        <ChatView v-if="chatRoomId != ''" :class_="chatClass" :currentUserType="user.type" :roomId="chatRoomId"
            :title="chatRoomtitle" @closeChat="closeChat"></ChatView>

    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth"
import { collection, getDocs, onSnapshot, updateDoc, doc, query, where, addDoc, getDoc, } from "firebase/firestore";
import { db } from "@/firebase"
import DoctorListPopup from "../../components/DoctorListPopup.vue"
import ChatView from "@/components/ChatView.vue";
import EmergencyCard from "@/components/emergencyCard.vue";
export default {
    data() {
        return {
            user: "",
            canOpenPopup: false,
            chatClass: "chat-box-hide",
            chatRoomId: "",
            chatRoomtitle: "",
            chatRooms: [],
            doctorList: [],
            chatList: [],

        };
    },
    async mounted() {
        const user = query(collection(db, "users"), where("id", "==", getAuth().currentUser.uid));
        await getDocs(user).then(snap => {
            if (snap.docs.length == 1) {
                this.user = snap.docs[0].data();
            }
        });

        console.log(this.user.type)
        if (this.user.type == "patients") {
            console.log("Patients")
            const rooms = query(collection(db, "emergencyrooms"), where("patient", "==", this.user.id))

            getDocs(rooms).then(snap => {
                console.log(snap.docs)
                snap.docs.forEach(d => {
                    this.chatRooms.push({
                        id: d.id,
                        info: d.data()
                    })
                })
            })
        } else {
            // this.user.type = "doctors"
            console.log("doctors")

            if (this.user.type == "assistants") {
                const dlistQ = query(collection(db, "doctor_assistant"), where("assistantId", "==", this.user.id))

                const dlist = await getDocs(dlistQ)

                dlist.docs.forEach(d => {
                    this.doctorList.push(d.data().doctorId)
                })

                const rooms = query(collection(db, "emergencyrooms"), where("doctorId", "in", this.doctorList))

                console.log(this.user.id)

                getDocs(rooms).then(snap => {
                    console.log(snap.docs)
                    snap.docs.forEach(d => {
                        this.chatRooms.push({
                            id: d.id,
                            info: d.data()
                        })
                    })
                })

                this.user.type = "doctors"
            } else {

                const rooms = query(collection(db, "emergencyrooms"), where("doctorId", "==", this.user.id))

                getDocs(rooms).then(snap => {
                    console.log(snap.docs)
                    snap.docs.forEach(d => {
                        this.chatRooms.push({
                            id: d.id,
                            info: d.data()
                        })
                    })
                })
            }
        }


    },
    methods: {
        openPopup() {
            this.canOpenPopup = true;
        },
        closePopup() {
            this.canOpenPopup = false;
        },
        closeChat() {
            this.chatClass = "chat-box-hide"
        },
        async startchat(id, name) {
            console.log(id)
            this.canOpenPopup = false
            this.chatRoomtitle = "Emergency chat with Dr." + name

            const p = query(collection(db, "patients"), where("uuid", "==", this.user.id))
            const pdata = await getDocs(p)

            addDoc(collection(db, "emergencyrooms"), {
                patient: this.user.id,
                patientName: pdata.docs[0].data().name,
                doctorId: id,
                doctorName: name
            }).then(r => {
                console.log(r.id);
                this.chatRoomId = r.id
                this.chatClass = "chat-box"

            })


        },
        async openinbox(data, user) {
            if (user.type == "patients") {
                this.chatRoomId = data.id
                this.chatRoomtitle = "Emergency chat with Dr." + data.info.doctorName
                this.chatClass = "chat-box"
                const q = query(collection(db, "chats"), where("roomId", "==", data.id), where("isRead", "==", false), where("who", "==", "doctors"))
                const docs = await getDocs(q)
                // console.log(docs)
                docs.docs.forEach(async chatRow => {
                    let row = doc(db, "chats", chatRow.id)
                    console.log("chat row :", row)
                    updateDoc(row, {
                        isRead: true
                    })
                })

            } else {
                this.chatRoomId = ""

                setTimeout( async() => {
                    this.chatRoomId = data.id
                    this.chatRoomtitle = "Emergency chat with " + data.info.patientName
                    this.chatClass = "chat-box"
                    const q = query(collection(db, "chats"), where("roomId", "==", data.id), where("isRead", "==", false), where("who", "==", "patients"))
                    const docs = await getDocs(q)
                    // console.log(docs)
                    docs.docs.forEach(async chatRow => {
                        let row = doc(db, "chats", chatRow.id)
                        console.log("chat row :", row)
                        updateDoc(row, {
                            isRead: true
                        })
                    })
                }, 1000)
            }

        }
    },
    components: { DoctorListPopup, ChatView, EmergencyCard }
}
</script>

<style>
</style>