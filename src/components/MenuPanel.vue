<template>
    <div class="p-bg">
        <div class="dash">
            <h1 class="text-center">Menu</h1>
            <div class="row">
                <div class="col-md-3" v-for="(item, index) in activeMenu" :key="index">
                    <div class="card" @click="openPage(item.link)">

                        <font-awesome-icon :icon="item.icon" size="4x" />
                        <h4 class="my-4">{{ item.title }}</h4>
                    </div>
                </div>
            </div>


        </div>
    </div>

</template>
<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, query, where, } from "firebase/firestore";
import { db } from "@/firebase"
import router from "@/router";
export default {
    name: "MenuPanel",

    data() {
        return {
            activeMenu: []
        }
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
    }
    ,
    methods: {
        openPage(r) {
            console.log(r)
            router.push(r)
        },
        checkProfile(userData) {

        }
    }
}
</script>

<style scoped>
.dash {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    /* margin-top: 100px; */
    padding: 20px;
    border-radius: 15px;
    /* background-color: white;
     */
    background-color: rgba(255, 255, 255, 0.9);

    /* box-shadow: 0px 0px 12px rgb(99, 95, 95); */
}

.p-bg {
    background: url("@/assets/img/p_login.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    padding-top: 100px;
}

.card {
    padding: 20px;
    /* padding-top:20px; */
    text-align: center;
    cursor: pointer;
}
</style>