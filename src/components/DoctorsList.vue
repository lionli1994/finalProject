<template>
    <div>
        <div class="search-box d-flex mt-4">
            <input type="text" placeholder="Search..." class="form-control" @input="search" v-model="searchTxt">
            <!-- <button class="btn btn-primary ms-2">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </button> -->
        </div>
        <div class="row">
            <div class="col-md-3" v-for="(doc, index) in docList" :key="index">
                <DocCard :forAssistant="forAssistant" @viewDoctor="viewDoctor" @makeAppointment="makeAppointment"
                    :data="doc" @openchat="openchat"></DocCard>
            </div>
        </div>
        <div class="row m-4" v-if="docList.length != 0">
            <div class="d-flex">
                <button @click="nextPage" class="ms-auto me-auto btn btn-primary">Show more</button>
            </div>
        </div>

        <!-- view  -->
        <div class="vd-box" v-if="canView">
            <div class="viewDoc">
                <div class="d-flex">
                    <h4>Doctor Information</h4>
                    <div class="btn btn-danger ms-auto" @click="closeView()">X</div>
                </div>

                <hr>
                <div>
                    <p>Name : {{ viewData.name }}</p>
                    <p>Telephone : {{ viewData.telephone }}</p>
                    <p>Email : {{ viewData.email }} </p>
                    <p>License Number : {{ viewData.licenseNumber }}</p>
                    <p>Expretise :

                    <ul>
                        <li v-for="(item, index) in viewData.expretise" :key="index">
                            {{ item }}
                        </li>
                    </ul>
                    </p>
                </div>
            </div>
        </div>

        <!-- make appointment -->

        <div class="appointment-box" v-if="appointmentBox">
            <div class="d-flex">
                <h4>Make New Appointment to Dr.{{ viewData.name }}</h4>
                <div class="btn btn-danger ms-auto" @click="closeAppointmentView()">X</div>
            </div>
            <hr>
            <div class="row" v-if="!canMake">
                <div class="alert alert-danger" role="alert">{{ errMsg }}</div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="mb-3">
                        <h6>Select Date & Time</h6>
                        <p style="color:red">NOTE : Time can be change by doctor</p>
                        <Datepicker v-model="date" :minDate="mindate" @update:modelValue="checkAvailabilityOfDate">
                        </Datepicker>
                    </div>


                    <div class="mb-3">
                        <label for="method">Method</label>
                        <div id="method">
                            <input type="radio" v-model="method" class="form-check-input" name="method" value="zoom">
                            Zoom
                            <input type="radio" v-model="method" class="form-check-input" name="method" value="chat">
                            Chat

                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="msg">Message</label>
                        <br>
                        <textarea class="form-control" id="msg" rows="6" v-model="msg"></textarea>
                    </div>

                </div>
                <div class="row">
                    <div class="mb-3 d-flex">
                        <button class="btn btn-primary ms-auto" style="width:200px"
                            @click="saveAppointment">Save</button>
                    </div>
                </div>
            </div>


        </div>


        <ChatView v-if="chatRoomId != ''" :class_="chatbox" @closeChat="closeChat" :roomId="chatRoomId"
            :currentUserType="'assistant'" :title="ChatRoomTitle"></ChatView>


    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, getDocs, query, where, Timestamp, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
import { Paginate, PaginateNext, Search } from "@/lib/paginate"
import DocCard from "./DocCard.vue"
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ChatView from "./ChatView.vue";

export default {
    name: "DoctorsList",
    data() {
        return {
            docList: [],
            lastDoc: {},
            viewData: {
                name: "",
                email: "",
                telephone: "",
                licenseNumber: "",
                expretise: []
            },
            canView: false,
            appointmentBox: false,
            date: "",
            method: "",
            msg: "",
            time: "",
            mindate: new Date(),
            currentDocId: "",
            currentDocemail: "",
            canMake: true,
            errMsg: "",
            searchTxt: "",
            doctorsForAssignment: [],
            currentUserDoc: "",
            forAssistant: false,
            chatRoomId: "",
            chatRoomTitle: "",
            chatbox: "chat-box-hide",


        }
    },
    components: {
        DocCard,
        Datepicker,
        ChatView
    }
    ,
    async created() {
        this.firstPage()


    },
    methods: {
        openchat(name, id) {
            console.log(name, id)
            this.chatRoomId = id
            this.chatRoomTitle = name
            this.chatbox = "chat-box"
        },
        closeChat() {
            this.chatRoomId = ""
            this.chatbox = "chat-box-hide"
        },

        async firstPage() {
            const page = await Paginate("doctors", "name", 20)
            const data = page
            console.log(data.docs)

            this.lastDoc = data.docs[data.docs.length - 1];

            console.log("Created doc list")

            const userQ = query(collection(db, "users"), where("id", "==", getAuth().currentUser.uid))
            const user = await getDocs(userQ)

            const doctor_assistantQ = query(collection(db, "doctor_assistant"), where("assistantId", "==", getAuth().currentUser.uid))
            const doctor_assistant = await getDocs(doctor_assistantQ)



            doctor_assistant.docs.forEach(doc => {
                this.doctorsForAssignment.push(doc.data().doctorId)
            })



            data.docs.forEach(doc => {
                console.log("doc", user.docs)
                console.log(doc.data())
                this.docList.push(doc.data())


            })
            this.currentUserDoc = user.docs[0].data()
            if (this.currentUserDoc.type == "assistants") {
                this.forAssistant = true
                console.log("assistants", this.doctorsForAssignment)
                this.docList = this.docList.filter(d => {
                    if (this.doctorsForAssignment.includes(d.uuid)) {
                        console.log("okok")
                        return d
                    }
                })
            }
        },
        async search() {
            this.docList = []
            if (this.searchTxt != "") {
                const page = await Search("doctors", where("name", ">=", this.searchTxt))
                this.docList = []
                const data = page

                data.docs.forEach(doc => {
                    console.log(doc.data())
                    this.docList.push(doc.data())
                })

                if (this.currentUserDoc.type == "assistants") {
                    console.log("assistants", this.doctorsForAssignment)
                    this.docList = this.docList.filter(d => {
                        if (this.doctorsForAssignment.includes(d.uuid)) {
                            console.log("okok")
                            return d
                        }
                    })
                }

            } else {
                this.firstPage()
            }



        },
        async nextPage() {
            if (this.lastDoc != undefined) {
                const page = await PaginateNext("doctors", "name", 20, this.lastDoc)
                const data = page

                this.lastDoc = data.docs[data.docs.length - 1];
                console.log("Created doc list")

                data.docs.forEach(doc => {
                    console.log(doc.data())
                    this.docList.push(doc.data())
                })

            }
        },
        viewDoctor(id, view = true) {
            const q = query(collection(db, "doctors"), where("uuid", "==", id))
            onSnapshot(q, (snap) => {
                snap.docs.forEach(doc => {
                    let d = doc.data()
                    this.viewData.name = d.name
                    this.viewData.email = d.email
                    this.viewData.telephone = d.phoneNumber
                    this.viewData.licenseNumber = d.licenseNumber

                })
            })


            const q2 = query(collection(db, "expretise"), where("doctorId", "==", id))
            onSnapshot(q2, (snap) => {
                snap.docs.forEach(doc => {
                    this.viewData.expretise.push(doc.data().name)
                })
            })


            this.canView = view
            console.log(id)
        },
        closeView() {
            this.canView = false
        },
        closeAppointmentView() {
            this.appointmentBox = false
        },
        makeAppointment(id, email) {
            this.viewDoctor(id, false)
            this.currentDocId = id
            console.log(id)
            this.appointmentBox = true
            this.currentDocemail = email
            // this.checkAvailabilityOfDate()

        },
        async checkAvailabilityOfDate() {
            console.log("🕛️", this.date.getDate())
            let day = this.date.toISOString().slice(0, 10)

            // let run = true
            // while (run){
            console.log(day)
            const q = query(collection(db, "appointments"), where("date", "==", day), where("doctorId", "==", this.currentDocId), where("status", "!=", "cancel"))
            console.log(this.mindate)
            await onSnapshot(q, (snap) => {
                // appointment count
                if (snap.docs.length > 10) {
                    // console.log(snap.docs.length)
                    // this.mindate = new Date(this.mindate)
                    // this.mindate = this.mindate.setDate(this.mindate.getDate() + 1)
                    // this.mindate = this.mindate.toISOString().slice(0, 10)
                    this.canMake = false
                    this.errMsg = "Can't make appointment in " + this.date.toISOString().slice(0, 10)
                } else {
                    console.log(snap.docs.length)
                    // run= false
                }
            })
            // }
        },
        async saveAppointment() {
            let day = this.date.toISOString().slice(0, 10)
            let time = this.date.getHours() + ":" + this.date.getMinutes()

            if (this.date != "") {
                if (this.method != "") {
                    this.canMake = true



                    await addDoc(collection(db, "appointments"), {
                        date: day,
                        doctorId: this.currentDocId,
                        method: this.method,
                        msg: this.msg,
                        status: "pending",
                        patientId: getAuth().currentUser.uid,
                        doctorName: this.viewData.name,
                        time: time,
                        createAt: Timestamp.now()
                    }).then(async (a) => {

                        this.$toast.success(`Appointment created successfully`);



                        //:TODO email send

                        const assisq = query(collection(db, "doctor_assistant"), where("doctorId","==",this.currentDocId))
                        const assis = await getDocs(assisq)

                        let assisList = []
                        assis.docs.forEach(a=>{
                            assisList.push(a.data().assistantId)
                        })


                        await addDoc(collection(db, "mail"), {
                            to: this.currentDocemail,
                            cc:assisList,
                            message: {
                                subject: 'NEW APPOINTMENT',
                                html: `
                                <html>
                                <body>
                                    <div>
                                        <h1>Appointment ID #${a.id.substring(12, 16)}</h1>
                                        <p>Date and Time ${day} - ${time}</p>
                                        <p>Method : ${this.method}</p>
                                        <p>Description : ${this.msg}</p>
                                    </div>
                                </body>
                                </html>
                                `,
                            },
                        })

                        this.appointmentBox = false
                        this.date = ""
                        this.method = ""
                        this.msg = ""

                    })

                } else {
                    this.canMake = false
                    this.errMsg = "Please select a method"
                }
            } else {
                this.canMake = false
                this.errMsg = "Please select a date"
            }
        }
    },


}
</script>

<style scoped>
.viewDoc {
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

.appointment-box {
    width: 50%;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    height: 600px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 1px 1px 15px gray;

}
</style>