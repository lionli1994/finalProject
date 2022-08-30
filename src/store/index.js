import { createStore } from "vuex";

export default createStore({
  state: {
    currentUser: {},
    menuList: [
      {
        title: "Find Doctors",
        icon: "fa-solid fa-user-doctor",
        link: "/dashboard/find-doctors",
        type: "p",
      },
      // {
      //     title: "Chats",
      //     icon: "fa-sloid fa-message",
      //     link: "/dashboard/chats",
      //     type: "p",
      // },
      {
        title: "Apointments",
        icon: "fa-solid fa-calendar-check",
        link: "/dashboard/my-appointments",
        type: "p",
      },
      {
        title: "Settings",
        icon: "fa-solid fa-gear",
        link: "/dashboard/settings",
        type: "all",
      },
      {
        title: "Apointments",
        icon: "fa-solid fa-calendar-check",
        link: "/dashboard/appointments",
        type: "d",
      },
      {
        title:"Find Assistant",
        icon:"fa-solid fa-headset",
        link:"/dashboard/find-assistants",
        type:"d"
      },
      {
        title: "Apointments",
        icon: "fa-solid fa-calendar-check",
        link: "/dashboard/appointments",
        type: "a",
      },
      {
        title: "Doctors",
        icon: "fa-solid fa-user-doctor",
        link: "/dashboard/find-doctors",
        type: "a",
      }


      
    ],
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
