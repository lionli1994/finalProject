<template>
  <div :class="class_">
    <div class="d-flex">
      <h4>{{ title }}</h4>
      <div class="btn btn-danger ms-auto" @click="closeChat">X</div>
    </div>
    <div class="box" id="chat-box-cotent" ref="box">

      <div v-for="(item, index) in chats" :key="index">

        <div v-if="currentUserType == item.who">
          <div class="d-flex">
            <div class="ms-auto me" v-if="item.msg.includes('https://')">
              <a :href="item.msg" style="color:white" target="_blank">
                <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
                {{ item.msg }}
              </a>
            </div>
            <div class="ms-auto me" v-else>{{ item.msg }}</div>
          </div>
        </div>

        <div v-if="currentUserType != item.who">
          <div class="d-flex">
            <div class="me-auto others" v-if="item.msg.includes('https://')">
              <a :href="item.msg" target="_blank">
                <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
                {{ item.msg }}
              </a>
            </div>
            <div class="me-auto others" v-else>{{ item.msg }}</div>
          </div>

        </div>



      </div>






      <!--  -->

      <!--  -->

    </div>
    <div class="inputs">
      <div class="d-flex">
        <input type="text" class="form-control" placeholder="type here..." v-model="msg">
        <button class="btn btn-primary btn ms-2" @click="sendMsg">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, onSnapshot, doc, Timestamp, query, getDoc, getDocs, updateDoc, where, limit, startAt, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/firebase"
export default {
  props: {
    class_: {
      type: String,
      required: true,
    },
    roomId: String,
    title: String,
    currentUserType: String,
  },
  data() {
    return {
      roomData: {
        id: "",
        patientId: "",
        doctorId: "",
        assistantId: "",

      },
      msg: "",
      l: "",
      chats: []

    }
  },
  mounted() {
    console.log(this.roomId)
    this.l = onSnapshot(query(collection(db, "chats"), where("roomId", "==", this.roomId), orderBy("time")), (snap) => {
      this.chats = []
      snap.docs.forEach(doc => {
        // console.log(doc.data())
        this.chats.push(doc.data())
      })
      // this.scrollToEnd()
    })
  }
  ,
  methods: {

    async sendMsg() {
      console.log(this.roomId)
      if (this.msg != "") {
        addDoc(collection(db, "chats"), {
          time: Timestamp.now(),
          who: this.currentUserType,
          msg: this.msg,
          roomId: this.roomId,
          isRead: false

        }).then(() => {
          this.msg = ""
          // this.scrollToEnd()
          console.log(this.chats.length)
          console.log(this.$refs["box"].scrollHeight)
          this.$refs["box"].scrollTop = this.$refs["box"].scrollHeight
        })
      }
    },
    closeChat() {
      this.l()
      this.$emit('closeChat')
    }


  },
  watch: {
    chats: {
      handler(newchats) {

        console.log("Watch", newchats.length)
        console.log(this.chats.length)
        setTimeout(() => {
          console.log(this.$refs["box"].scrollHeight)
          this.$refs["box"].scrollTop = this.$refs["box"].scrollHeight
        }, 1000)

      },
      // force eager callback execution
      // immediate: true
    }
  }
}
</script>

<style scoped>
.chat-box {
  padding: 10px;
  width: 50%;
  height: 800px;
  position: fixed;
  bottom: 0;
  right: 0;
  background: white;
  box-shadow: 1px 1px 15px gray;
  border-radius: 15px;
  transition: 500ms;
}

.chat-box-hide {
  padding: 10px;
  width: 0%;
  height: 600px;
  position: fixed;
  bottom: -100vh;
  right: 0;
  background: white;
  box-shadow: 1px 1px 15px gray;
  border-radius: 15px;
  transition: 500ms;

}

.box {
  margin-top: 5px;
  height: 680px;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  /* background-color: aqua; */
  /* overflow: scroll; */
  overflow-y: scroll
}

.inputs {
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  height: 50px;
}

.me {
  background-color: rgb(50, 110, 253);
  padding: 10px;
  margin: 10px;
  color: white;
  border-radius: 10px;
  max-width: 80%;
}

.others {
  background-color: lightblue;
  padding: 10px;
  margin: 10px;
  /* color: white; */
  border-radius: 10px;
  max-width: 80%;

}
</style>