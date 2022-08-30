<template>
    <div :class="zoomLinkBox">
        <div class="row p-4">
            <div class="d-flex mb-3">
                <h4>Send zoom link to patient</h4>
                <div class="btn btn-danger ms-auto" @click="$emit('close')">X</div>
            </div>
            <div class="row">
                <div class="card p-4 ">
                    <div class="card-body">

                        <div class="mb-4">
                            <label for="zoom-link">
                                <h3>Zoom Link</h3>
                            </label>
                            <input type="text" placeholder="Enter zoom link here ..." v-model="link" id="zoom-link"
                                class="form-control">
                        </div>
                        <div class="mb-4">
                            <div class="d-flex">
                                <button class="btn btn-primary ms-auto" style="width:200px"
                                    @click="sendLink">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, getDoc, getDocs, updateDoc, where, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"

export default {
    props: {
        appointmentId: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            zoomLinkBox: "zoom-link-box",
            link: ""
        }
    },
    methods: {
        async sendLink() {

            let q = query(collection(db, "zoomlinks"), where("appointmentId", "==", this.appointmentId))
            getDocs(q).then((data) => {
                if (data.docs.length == 1) {
                    let link = doc(db, "zoomlinks", data.docs[0].id)
                    updateDoc(link, {
                        link: this.link,
                        isRead: false,
                    }).then(() => {
                        this.$toast.success("Zoom Link Update successfully")
                        this.$emit("close")
                    
                    })


                } else {
                    addDoc(collection(db, "zoomlinks"), {
                        appointmentId: this.appointmentId,
                        link: this.link,
                        isRead: false,
                    }).then(() => {
                        this.$toast.success("Zoom Link Send successfully")
                        $this.$emit("close")
                    })
                }
            })


        }
    }
}
</script>

<style scoped>
.zoom-link-box {
    width: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    height: 40vh;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 1px 1px 15px gray;
}
</style>