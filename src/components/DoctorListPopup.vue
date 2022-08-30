<template>
    <div class="doctors-box">
        <div class="d-flex mb-3">
            <h4>Doctor List</h4>
            <div class="btn btn-danger ms-auto" @click="$emit('close')">X</div>
        </div>

        <div>

            <div class="mb-3">
                <input type="text" v-model="search" class="form-control" placeholder="search...">
            </div>
            <hr>
            <ul class="list-group">
                <li class="list-group-item" v-for="(item, index) in doctors" :key="index">
                    <div>
                        <div class="d-flex">
                            Dr.{{ item.name }}
                            <button class="btn btn-primary btn-sm ms-auto" @click="$emit('startchat',item.uuid,item.name)">chat</button>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, Timestamp, query, getDoc, getDocs, updateDoc, where, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
export default {
    data() {
        return {
            search: "",
            doctors: []
        }
    },
    mounted() {
        const q = query(collection(db, "doctors"))
        getDocs(q).then(snap => {
            snap.docs.forEach(d => {
                this.doctors.push(d.data())
            })
        })
    }
}
</script>

<style scoped>
.doctors-box {
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    height: 600px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 1px 1px 15px gray;
    overflow-y: scroll
}
</style>