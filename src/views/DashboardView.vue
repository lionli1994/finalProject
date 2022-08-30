<template>

    <div>
        <nav class="navbar navbar-dark bg-dark">
            <div class="container-fluid">
                <a href="/dashboard" class="navbar-brand">HMO</a>
                

                <div class="d-flex">
                    <a href="/dashboard/emergency" class="navbar-brand"><button class="btn btn-success">
                        
                        Emergency
                        
                    </button></a>

                    <a v-for="(item, index) in activeMenu" :key="index" :href="item.link" class="nav-link">
                        <font-awesome-icon :icon="item.icon" />
                        {{ item.title }}
                    </a>

                    <a class="nav-link" @click="handleSingOut"> | Sign Out</a>
                </div>
            </div>
        </nav>


        <div class="p-bg" style="height:100vh;width:100%">
            <router-view></router-view>

        </div>



    </div>




</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where } from "firebase/firestore";
import { db } from "@/firebase"
import router from "@/router";


let auth
let currentUserData
// const patientColRef = collection(db, "users")
export default {
    name: "DashboardView",
    data() {
        return {
            isLoggedIn: false,

            activeMenu: []

        }
    },
    mounted() {
        onAuthStateChanged(getAuth(), (user) => {

            if (user) {
                this.isLoggedIn = true
            } else {
                this.isLoggedIn = false
            }
        })
    },
    beforeMount() {
        let auth = getAuth();

        const q = query(collection(db, "users"), where("id", "==", auth.currentUser.uid))

        onSnapshot(q, (snap) => {

            snap.docs.forEach((doc) => {
                console.log(doc.data())
                let currentUserData = doc.data()

                switch (currentUserData.type) {
                    case "patients":
                        this.activeMenu = this.$store.state.menuList.filter(menu => menu.type == "p" || menu.type == "all")
                        break

                    case "doctors":
                        this.activeMenu = this.$store.state.menuList.filter(menu => menu.type == "d" || menu.type == "all")
                        break
                    case "assistants":
                        this.activeMenu = this.$store.state.menuList.filter(menu => menu.type == "a" || menu.type == "all")
                        break

                    case "owners":
                        this.activeMenu = this.$store.state.menuList.filter(menu => menu.type == "o" || menu.type == "all")
                        break

                    default:
                        this.activeMenu = []
                        console.log("none")
                }
            })
        })
    },

    methods: {
        handleSingOut() {
            signOut(getAuth()).then(() => {
                router.push("/")
                window.location.reload()
            })
        }
    },

    components: {

    }

}






</script>
<style scoped>
.nav-link {
    color: white;
    display: block;
    margin: 10px;
    font-size: 20px;
    cursor: pointer;
}
</style>