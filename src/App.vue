<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <button  @click="handleSingOut" v-if="isLoggedIn">log out</button>
  </nav> -->
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getAuth, onAuthStateChanged,signOut } from "firebase/auth"
import router from "./router/index.js";

const isLoggedIn = ref(false)

let auth
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth,(user) => {
    if(user){
      isLoggedIn.value = true
    }else{
      isLoggedIn.value = false
    }
  })
})

const handleSingOut = () => {
  signOut(auth).then(()=>{
    router.push("/")
  })
 }




</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";

@import "assets/css/styles.css";

</style>
