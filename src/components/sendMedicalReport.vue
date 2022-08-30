<template>
    <div class="sendreport-box">
        <div class="d-flex mb-3">
            <h4>Send Medical Report</h4>
            <div class="btn btn-danger ms-auto" @click="$emit('close')">X</div>
        </div>
        <div class="mb-3">
            <h5>Sent reports</h5>
            <ul>
                <li v-for="(item, index) in fileList" :key="index">
                    <a :href="item" target="_blank">Report {{index+1}}</a>
                </li>
            </ul>
        </div>
        <form @submit.prevent="upload">
            <div class="mb-3">
                <label for="file">Select File</label>
                <input type="file" class="form-control" name="file" required>
            </div>
            <div class="mb-3 d-flex">
                <button type="submit" class="btn btn-primary ms-auto me-auto">Upload</button>
            </div>
        </form>
    </div>
</template>

<script>
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, getDocs, updateDoc, Timestamp, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {

        return {
            fileList: []
        }
    },
    mounted() {
        const storage = getStorage();
        const q = query(collection(db, "medicalReports"), where("appointmentId", "==", this.id))
        getDocs(q).then(snap => {
            snap.docs.forEach(d => {
                const starsRef = ref(storage,d.data().fileName);

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
    methods: {
        async upload(event) {
            console.log("upload")
            let form = event.target
            let file = form.file.files[0]
            console.log(file.name)

            const storage = getStorage();
            const storageRef = ref(storage, "reports/" + this.id + file.name);

            uploadBytes(storageRef, file).then((snapshot) => {

                console.log('Uploaded a blob or file!', snapshot.ref);
                addDoc(collection(db, "medicalReports"), {
                    appointmentId: this.id,
                    fileName: "reports/" + this.id + file.name
                }).then(() => {
                    this.$toast.success("Report uploaded successfully")
                    this.$emit("close")
                })

            });

        }
    }
}
</script>

<style scoped>
.sendreport-box {
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
}
</style>