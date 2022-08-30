<template>
    <div v-if="msgNum">
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" >
            {{ msgNum }}
            <span class="visually-hidden">unread messages</span>
        </span>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, Timestamp, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
export default {
    props:{
        id:{
            type:String,
            required:true,
        },
        userType:{
            type:String,
            required:true,
        },
        condition:{
            type:String,
            required:true,
        }
    },
    data(){
        return{
            msgNum:0,
            l:''
        }
    },
    mounted() {
        const q = query(collection(db, "chats"), where("roomId", "==", this.id), where("isRead", "==", false), where("who", this.condition, this.userType))
        this.l = onSnapshot(q, snap => {
            console.log(snap.docs)
            this.msgNum = snap.docs.length
            console.log(this.msgNum)

        })
    },
    unmounted(){
        this.l()
    }

}
</script>

<style>
</style>