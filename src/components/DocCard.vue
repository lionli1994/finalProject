<template>
    <div class="card m-3">
        <img src="@/assets/img/doc.webp" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Dr .{{ data.name }}</h5>
            <div class="d-flex">
                <a href="#" @click="view(data.uuid)" class="ms-auto btn btn-primary btn-sm" title="View">
                    <font-awesome-icon icon="fa-solid fa-eye" />
                </a>
                <!-- <a href="#" class="ms-2 btn btn-primary btn-sm" title="chat"><font-awesome-icon icon="fa-solid fa-comments" /></a> -->
                <a href="#" v-if="!forAssistant" @click="clickAppointment(data.uuid,data.email)"
                    class="ms-2 btn btn-primary btn-sm" title="appointment">
                    <font-awesome-icon icon="fa-solid fa-calendar-check" />
                </a>

                <button v-if="forAssistant" class="btn btn-primary btn-sm ms-2" @click="openchat()">Chat
                        <ChatNotificationDot :id="chatRoomId" :condition="'=='" :userType="'doctors'"></ChatNotificationDot>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, getDocs, query, where, Timestamp, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
import ChatNotificationDot from "./ChatNotificationDot.vue";

export default {
    name: "docCard",
    props: {
        data: {
            type: Object,
            required: true,
        },
        forAssistant: Boolean
    },
    data() {
        return {
            chatRoomId: ""
        };
    },
    async created() {
        // console.log("Created", this.data)
        if (this.forAssistant) {
            const doctor_assistantQ = query(collection(db, "doctor_assistant"), where("assistantId", "==", getAuth().currentUser.uid), where("doctorId", "==", this.data.uuid));
            const doctor_assistant = await getDocs(doctor_assistantQ);
            this.chatRoomId = doctor_assistant.docs[0].id;
            console.log(this.chatRoomId);
        }
    },
    methods: {
        view(id) {
            console.log("View", id);
            this.$emit("viewDoctor", id);
        },
        clickAppointment(id,email) {
            this.$emit("makeAppointment", id,email);
        },
        openchat(){
            this.$emit("openchat",this.data.name,this.chatRoomId);
        }
    },
    components: { ChatNotificationDot }
}
</script>