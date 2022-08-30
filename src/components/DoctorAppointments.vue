<template>
    <div class="row">
        <div class="col-md-12 p-3">
            <div class="card mb-3 p-4" v-for="(item, index) in items" :key="index">
                <div class="row">
                    <!-- <div class="col-md-8"> -->
                    <div class="h4">ID #{{ item.id.substring(12, 16).toUpperCase() }}</div>
                    <div class="h5">
                        {{ item.date }} - {{ item.time }}
                    </div>
                    <div class="h6">
                        {{ item.method }}
                    </div>
                    <p>
                        {{ item.msg }}
                    </p>
                    <!-- </div> -->

                </div>
                <div class="row d-flex" v-if="item.status == 'pending'">
                    <button class="btn btn-primary ms-auto" style="width:200px" @click="view(item.id)">View</button>
                    <!-- <button class="btn btn-danger ms-2" style="width:200px" @click="cancel(item.id)">Cancel</button> -->
                </div>
                <div class="row d-flex" v-if="item.status == 'active'">
                    <a  href="#" class="btn btn-primary ms-auto" style="width:200px" @click="view(item.id)">View</a>

                    <button class="btn btn-primary ms-2" style="width:200px" v-if="item.method == 'chat'"
                        @click="makeResponse(item.id, 'chat')">

                        Chat
                        <ChatNotificationDot :id="item.id" :condition="'=='" :userType="'patients'">
                        </ChatNotificationDot>

                    </button>
                    <button class="btn btn-primary ms-2" style="width:200px" v-if="item.method == 'zoom'"
                        @click="makeResponse(item.id, 'zoom')">Start Zoom</button>

                    <button class="btn btn-primary ms-2" style="width:200px" @click="$emit('sendreport',item.id)">Send Medical Report</button>
                    <button class="btn btn-success ms-2" style="width:200px">Mark as Done</button>



                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChatNotificationDot from './ChatNotificationDot.vue';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where,getDocs,updateDoc, Timestamp, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
export default {
    props: {
        items: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {

        };
    },
    methods: {
        cancel(id) {
            this.$emit("cancel", id);
        },
        view(id) {
            this.$emit("view", id);
        },
        async makeResponse(id, type) {
            this.$emit("makeresponse", id, type);
            const q = query(collection(db, "chats"), where("roomId", "==", id), where("isRead", "==", false), where("who", "==", "patients"))
            const docs = await getDocs(q)
            // console.log(docs)
            docs.docs.forEach(async chatRow => {
                let row = doc(db, "chats", chatRow.id)
                console.log("chat row :",row)
                updateDoc(row, {
                    isRead: true
                })
            })
        }
    },
    components: { ChatNotificationDot }
}
</script>

<style>
</style>