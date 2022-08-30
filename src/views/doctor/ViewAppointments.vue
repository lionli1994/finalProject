<template>
    <div class="container">
        <div class="row" style="margin-top:50px">
            <a href="/dashboard" class="btn btn-secondary mb-3" style="width:100px">Back</a>

            <h3>Appointments</h3>
            <hr>
            <div class="col-md-12">
                <TabNav :tabs='["Active", "Today", "All"]' :selected="selectedTab" @selected="setSelected">
                    <TabTag :isSelected="selectedTab == 'Active'">
                        <DoctorAppointments :items="active" @view="viewAppointment" @makeresponse="makeResponse"
                            @sendreport="sendReport">
                        </DoctorAppointments>
                    </TabTag>
                    <TabTag :isSelected="selectedTab == 'Today'">
                        <DoctorAppointments :items="today" @view="viewAppointment">

                        </DoctorAppointments>
                    </TabTag>
                    <TabTag :isSelected="selectedTab == 'All'">
                        <DoctorAppointments :items="all" @view="viewAppointment">
                        </DoctorAppointments>
                    </TabTag>
                </TabNav>
            </div>
        </div>

        <div class="abox" v-if="abox">
            <div class="d-flex">
                <h4>Appointment</h4>
                <div class="btn btn-danger ms-auto" @click="abox = false">X</div>
            </div>

            <div class="row">
                <p>Patient Name : {{ currentAppointment.patientName }}</p>
                <p>Patient Email : {{ currentAppointment.patientEmail }}</p>
                <p>Patient Gender : {{ currentAppointment.patientGender }}</p>
                <p>Date And Time : {{ currentAppointment.date }} - {{ currentAppointment.time }}</p>
                <p>Method : {{ currentAppointment.method }}</p>
                <p>Status : {{ currentAppointment.status }}</p>

                <p style="margin-bottom: 50px">Message : {{ currentAppointment.msg }}</p>


                <div class="mb-3" v-if="currentAppointment.status == 'pending'">
                    <label for="time">Set Time</label>
                    <input type="time" name="" id="time" v-model="currentAppointment.time">
                </div>

                <div class="mt-auto mb-2 d-flex" v-if="currentAppointment.status == 'pending'">
                    <button class="btn btn-success ms-auto" @click="maskAsActive(currentAppointment.id)">Mark as
                        Active</button>
                </div>

            </div>

        </div>


        <ChatView v-if="chatRoomId != ''" :class_="chatbox" @closeChat="closeChat" :roomId="chatRoomId"
            :title="ChatRoomTitle" :currentUserType="currentUserType"></ChatView>

        <ZoomLinkSendBox v-if="showZoomBox" @close="closeZoomBox" :appointmentId="currentAppointment.id">
        </ZoomLinkSendBox>

        <SendMedicalReport v-if="showSendreport" :id="currentAppointment.id"  @close="closeSendReport"></SendMedicalReport>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, getDoc, getDocs, updateDoc, where, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
import TabTag from "@/components/Tab.vue"
import TabNav from "@/components/TabNav.vue"
import DoctorAppointments from "@/components/DoctorAppointments.vue";
import ChatView from "@/components/ChatView.vue";
import ZoomLinkSendBox from "@/components/ZoomLinkSendBox.vue";
import SendMedicalReport from "../../components/sendMedicalReport.vue";
export default {
    components: {
        TabNav,
        TabTag,
        TabNav,
        DoctorAppointments,
        ChatView,
        ZoomLinkSendBox,
        SendMedicalReport
    },
    data() {
        return {
            selectedTab: "Active",
            all: [],
            today: [],
            active: [],
            abox: false,
            currentAppointment: {
                id: "",
                patientName: "",
                patientEmail: "",
                patientBday: "",
                patientGender: "",
                date: "",
                method: "",
                status: "",
                patientId: "",
                doctorId: "",
                doctorName: "",
                msg: "",
                time: ""

            },
            chatbox: "chat-box-hide",
            chatRoomId: "",
            ChatRoomTitle: "",
            currentUserType: "",
            showZoomBox: false,
            currentUser: "",
            doctorList: [],
            showSendreport: false,

        }
    },
    methods: {
        closeSendReport(){
            this.showSendreport = false;
        },
        sendReport(id) {
            console.log(id)
            this.currentAppointment.id = id
            this.showSendreport = true;

        },

        makeResponse(id, type) {
            console.log(id, type)
            if (type == "chat") {
                this.startchat(id)
            } else if (type == "zoom") {
                this.startZoom(id)
            }

        },
        async startZoom(appointmentId) {
            const appoQ = doc(db, "appointments", appointmentId)
            const appoDoc = await getDoc(appoQ)

            const userQ = query(collection(db, "users"), where("id", "==", getAuth().currentUser.uid))
            let userDoc = await getDocs(userQ)
            if (userDoc.docs.length == 1) {



                this.showZoomBox = true
                this.currentAppointment.id = appoDoc.id




            }
        },
        closeZoomBox() {
            this.showZoomBox = false
        }

        ,
        async startchat(appointmentId) {
            const appoQ = doc(db, "appointments", appointmentId)
            const appoDoc = await getDoc(appoQ)

            const userQ = query(collection(db, "users"), where("id", "==", getAuth().currentUser.uid))
            let userDoc = await getDocs(userQ)




            if (userDoc.docs.length == 1) {
                // console.log(userDoc.docs[0].data(), appoDoc.data())
                // this.currentUserType = userDoc.docs[0].data().type

                // const patientQ = query(collection(db, "patients"), where("uuid", "==", appoDoc.data().patientId))
                // const patientDoc = await getDocs(patientQ)


                this.chatRoomId = appoDoc.id
                if (userDoc.docs[0].data().type != "patients") {
                    this.currentUserType = "doctors"
                    const patientQ = query(collection(db, "patients"), where("uuid", "==", appoDoc.data().patientId))
                    const patientDoc = await getDocs(patientQ)
                    if (patientDoc.docs.length == 1) {
                        this.ChatRoomTitle = patientDoc.docs[0].data().name + " | Appointment ID #" + appoDoc.id.substring(12, 16)
                        this.chatbox = "chat-box"
                    }


                } else {
                    this.currentUserType = "patients"

                    const doctorQ = query(collection(db, "doctors"), where("uuid", "==", appoDoc.data().doctorId))
                    const doctorDoc = await getDocs(patientQ)
                    if (doctorDoc.docs.length == 1) {
                        this.ChatRoomTitle = "Dr." + doctorDoc.docs[0].data().name + " | Appointment ID #" + appoDoc.id.substring(12, 16)
                        this.chatbox = "chat-box"

                    }
                }




            }




        },
        closeChat() {
            this.chatbox = "chat-box-hide"
            this.chatRoomId = ""
        }
        ,
        setSelected(tab) {
            this.selectedTab = tab;
        },
        async viewAppointment(id) {
            console.log(id)


            const docRef = doc(db, "appointments", id)
            const docSnap = await getDoc(docRef);

            let appointment = docSnap.data()

            const patientQ = query(collection(db, "patients"), where("uuid", "==", appointment.patientId))


            let p

            onSnapshot(patientQ, snap => {
                snap.docs.forEach(doc => {
                    // console.log(doc.data())
                    p = doc.data()
                    this.currentAppointment.patientName = p.name
                    this.currentAppointment.patientEmail = p.email
                    this.currentAppointment.patientGender = p.gender
                    this.currentAppointment.patientBday = p.bday
                })
            })


            this.currentAppointment.date = appointment.date
            this.currentAppointment.method = appointment.method
            this.currentAppointment.status = appointment.status
            this.currentAppointment.patientId = appointment.patientId
            this.currentAppointment.doctorId = appointment.doctorId
            this.currentAppointment.doctorName = appointment.doctorName
            this.currentAppointment.msg = appointment.msg
            this.currentAppointment.id = docSnap.id
            this.currentAppointment.time = appointment.time

            // console.log(this.currentAppointment)

            this.abox = true

        },
        async maskAsActive(id) {
            console.log(id)
            const docRef = doc(db, "appointments", id)
            updateDoc(docRef, {
                status: "active",
                time: this.currentAppointment.time
            }).then(() => {
                this.$toast.success(`Appointment Active successfully`);
                this.abox = false
                this.selectedTab = "Active"
                this.refresh();


            })
        },
        async refresh() {

            const userQ = query(collection(db, "users"), where("id", "==", getAuth().currentUser.uid))
            const user = await getDocs(userQ)
            this.currentUser = user.docs[0].data()

            console.log(this.currentUser)



            if (this.currentUser.type == "assistants") {
                const dlistQ = query(collection(db, "doctor_assistant"), where("assistantId", "==", this.currentUser.id))

                const dlist = await getDocs(dlistQ)

                dlist.docs.forEach(d => {
                    this.doctorList.push(d.data().doctorId)
                })

                const q = query(collection(db, "appointments"), where("status", "!=", "cancel"), where("doctorId", "in", this.doctorList));

                onSnapshot(q, (snap) => {
                    this.today = []
                    this.all = []
                    this.active = []
                    snap.docs.forEach(doc => {
                        let item = {
                            id: doc.id,
                            doctorName: doc.data().doctorName,
                            date: doc.data().date,
                            method: doc.data().method,
                            status: doc.data().status,
                            time: doc.data().time,
                            doctorId: doc.data().doctorId,
                            msg: doc.data().msg,

                        }

                        if (item.status) {
                            this.all.push(item);
                        }

                        if (item.date == new Date().toISOString().slice(0, 10) && item.status != "active") {
                            this.today.push(item)
                        }

                        if (item.status == "active") {
                            this.active.push(item);
                        }

                    })
                })


            }

            // console.log(this.doctorList)
            if (this.currentUser.type == "doctors") {
                console.log(this.currentUser.type)
                const q = query(collection(db, "appointments"), where("status", "!=", "cancel"), where("doctorId", "==", getAuth().currentUser.uid));

                onSnapshot(q, (snap) => {
                    this.today = []
                    this.all = []
                    this.active = []
                    snap.docs.forEach(doc => {
                        let item = {
                            id: doc.id,
                            doctorName: doc.data().doctorName,
                            date: doc.data().date,
                            method: doc.data().method,
                            status: doc.data().status,
                            time: doc.data().time,
                            doctorId: doc.data().doctorId,
                            msg: doc.data().msg,

                        }

                        if (item.status) {
                            this.all.push(item);
                        }

                        if (item.date == new Date().toISOString().slice(0, 10) && item.status != "active") {
                            this.today.push(item)
                        }

                        if (item.status == "active") {
                            this.active.push(item);
                        }

                    })
                })

            }

        }
    },
    mounted() {
        this.refresh()
    }

}
</script>

<style scoped>
.abox {
    width: 450px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    height: 500px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 1px 1px 15px gray;

}
</style>