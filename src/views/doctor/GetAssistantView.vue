<template>
    <div class="container">
        <div class="row mt-4">
            <div class="col-md-12">

                <TabNav :tabs="['All', 'My Assistant']" :selected="selectedTab" @selected="setSelected">

                    <TabTag :isSelected="selectedTab === 'All'">
                        <div class="mt-4">
                            <div class="row">
                                <div class="mb-3">
                                    <input type="text" id="" class="form-control" placeholder="Search Assistants...."
                                        v-model="searchTxt" @input="search">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3" v-for="(item, index) in docList" :key="index">
                                    <AssistantCard :data="item" :isMy="false"></AssistantCard>
                                </div>
                            </div>
                            <div class="row">
                                <div class="d-flex">
                                    <button class="btn btn-primary ms-auto me-auto" @click="nextPage">Show more</button>
                                </div>
                            </div>
                        </div>
                    </TabTag>

                    <TabTag :isSelected="selectedTab === 'My Assistant'">
                        <div class="mt-4">
                            <div class="row">
                                <div class="col-md-3" v-for="(item, index) in myAssistants" :key="index">
                                    <AssistantCard :data="item" :isMy="true" @startchat="startChat"></AssistantCard>
                                </div>
                            </div>
                        </div>
                    </TabTag>

                </TabNav>


            </div>
        </div>
        <ChatView v-if="chatRoomId != ''" :class_="chatClass" @closeChat="closeChat" :currentUserType="currentUserType"
            :roomId="chatRoomId" :title="chatRoomTitle" :closeChat="closeChat"></ChatView>
    </div>

</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, getDoc, Timestamp, limit, startAt, orderBy, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase"
import { Search, Paginate, PaginateNext } from "@/lib/paginate"
import AssistantCard from "@/components/AssistantCard.vue";
import TabTag from "@/components/Tab.vue"
import TabNav from "@/components/TabNav.vue"
import ChatView from "@/components/ChatView.vue";
export default {
    components: {
        AssistantCard,
        TabNav,
        TabTag,
        ChatView
    },
    data() {
        return {
            docList: [],
            lastDoc: "",
            searchTxt: "",
            selectedTab: "All",
            myAssistants: [],
            chatClass: "chat-box-hide",
            chatRoomId: "",
            chatRoomTitle: "",
            currentUserType: "doctors"
        }
    },
    created() {
        this.firstPage()
        // this.getMyAssistants()
    },
    methods: {
        closeChat() {
            this.chatClass = "chat-box-hide"
            this.chatRoomId = ""

        },
        async startChat(a_id) {
            console.log(a_id);
            const q = query(collection(db, "doctor_assistant"), where("doctorId", "==", getAuth().currentUser.uid), where("assistantId", "==", a_id))
            getDocs(q).then(rooms => {
                rooms.docs.forEach(doc => {
                    console.log(doc.data());
                    this.chatRoomId = doc.id
                    this.chatRoomTitle = doc.data().assistantName
                    this.chatClass = "chat-box"
                })
            })
        },
        async getMyAssistants() {
            this.myAssistants = []
            const q = query(collection(db, "doctor_assistant"), where("doctorId", "==", getAuth().currentUser.uid))
            let a_ids = []
            getDocs(q).then(docs1 => {
                docs1.docs.forEach(async a => {
                    a_ids.push(a.data().assistantId)
                })
            }).then(() => {
                let q2 = query(collection(db, "assistants"), where("uuid", "in", a_ids))
                getDocs(q2).then(docs1 => {
                    docs1.docs.forEach(a => {
                        this.myAssistants.push(a.data())
                    })
                })
            })





        },
        setSelected(tab) {
            this.selectedTab = tab;
            this.getMyAssistants()
        },
        async firstPage() {
            this.docList = []
            const page = await Paginate("assistants", "name", 20)
            const data = page
            console.log(data.docs)

            this.lastDoc = data.docs[data.docs.length - 1];

            console.log("Created doc list")

            data.docs.forEach(doc => {
                console.log(doc.data())
                this.docList.push(doc.data())
            })
        },
        async search() {
            this.docList = []

            if (this.searchTxt != "") {
                const page = await Search("assistants", where("name", ">=", this.searchTxt))
                this.docList = []
                const data = page

                data.docs.forEach(doc => {
                    console.log(doc.data())
                    this.docList.push(doc.data())

                })

            } else {
                this.firstPage()
            }



        },
        async nextPage() {
            if (this.lastDoc != undefined) {
                const page = await PaginateNext("assistants", "name", 20, this.lastDoc)
                const data = page

                this.lastDoc = data.docs[data.docs.length - 1];
                console.log("Created doc list")

                data.docs.forEach(doc => {
                    console.log(doc.data())
                    this.docList.push(doc.data())
                })

            }
        }
    }
}
</script>

<style>
</style>