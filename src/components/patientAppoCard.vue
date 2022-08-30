<template>
    <div>
        <div class="card mb-3">
            <div class="card-header">
                ID #{{ item.id.substring(12, 16).toUpperCase() }}
            </div>
            <div class="card-body">
                <h4>{{ item.date }}</h4>
                <h5 class="card-title">Dr.{{ item.doctorName }}</h5>
                <p class="card-text">Method : {{ item.method }}</p>
                <p class="card-text">Status : {{ item.status }}</p>
                <p class="card-text">Time : {{ item.time }}</p>
                <p class="card-text">Reports</p>

                <ul>
                    <li v-for="(item, index) in fileList" :key="index">
                        <a :href="item" target="_blank">Report {{ index + 1 }}</a>
                    </li>
                </ul>
                <div class="d-flex">

                    <button class="btn btn-danger ms-auto" @click="$emit('cancel', item.id)"> Cancel </button>

                    <button type="button" class="btn btn-primary position-relative ms-2" v-if="item.method == 'chat'"
                        @click="openInbox">
                        Inbox
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            v-if="msgNum">
                            {{ msgNum }}
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </button>

                    <a :href="meetinglink" target="_blank" class="btn btn-primary position-relative ms-2"
                        v-if="item.method == 'zoom'">
                        Join Meeting at {{ item.date }} - {{ item.time }}
                        <span
                            class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
                            v-if="isMeetingLinkRead">
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </a>


                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, Timestamp, limit, startAt, orderBy, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"

export default {
    props: {
        item: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            msgNum: 0,
            l: "",
            chatbox: "chat-box-hide",
            chatRoomId: "",
            ChatRoomTitle: "",
            currentUserType: "patients",
            l2: "",
            meetinglink: "",
            isMeetingLinkRead: false,
            fileList:[]
        }
    },
    methods: {
        closeChat() {
            this.chatbox = "chat-box-hide"
        },
        async openInbox() {



            this.$emit("openInbox", this.item.id, this.item.doctorName + " | ID #" + this.item.id.substring(12, 16).toUpperCase())



        }
    },
    mounted() {
        const q = query(collection(db, "chats"), where("roomId", "==", this.item.id), where("isRead", "==", false), where("who", "!=", "patients"))
        this.l = onSnapshot(q, snap => {
            this.msgNum = snap.docs.length

        })

        const q2 = query(collection(db, "zoomlinks"), where("appointmentId", "==", this.item.id))
        this.l2 = onSnapshot(q2, snap => {
            snap.docs.forEach(doc => {
                this.meetinglink = doc.data().link
                this.isMeetingLinkRead = doc.data().isRead
            })
        })

        const storage = getStorage();
        const q3 = query(collection(db, "medicalReports"), where("appointmentId", "==", this.item.id))
        onSnapshot(q3, snap => {
            snap.docs.forEach(d => {
                const starsRef = ref(storage, d.data().fileName);

                // Get the download URL
                getDownloadURL(starsRef)
                    .then((url) => {
                        this.fileList.push(url);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
        })


    },
    unmounted() {
        this.l()
    }

}
</script>

<style>
</style>