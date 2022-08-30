<template>

    <li class="list-group-item">
        <div class="d-flex">
           
            <div >Dr.{{ data.info.doctorName }} |  {{ data.info.patientName }} </div>

            <button type="button" class="btn btn-primary position-relative ms-auto btn-sm" @click="$emit('openinbox',data,user)" >
                Inbox
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    v-if="num">
                    {{ num }}
                    <span class="visually-hidden">unread messages</span>
                </span>
            </button>

        </div>
    </li>

</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, Timestamp, query, getDoc, getDocs, updateDoc, where, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            num: 0
        }
    },
    mounted() {
        if (this.user.type == "assistants"){
            this.user.type = "doctors"
        }
        const q = query(collection(db, "chats"), where("roomId", "==", this.data.id), where("isRead", "==", false), where("who", "!=", this.user.type))
        this.l = onSnapshot(q, snap => {
            this.num = snap.docs.length

        })
    }

}
</script>

<style>
</style>