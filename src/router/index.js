import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: () => import("@/views/HomeView.vue"),
  // },
  {
    path: "/",
    name: "login_patient",
    component: () => import("@/views/login/LoginPatientsView.vue"),

  },
  {
    path:"/crew/singin",
    name:"crew_singin",
    component: () => import("@/views/login/LoginCrewView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: {
      requiresAuth: true,
    },
    children:[
      {
        path:"find-doctors",
        component: () => import("@/views/patients/FindDoctorView.vue")
      },
      {
        path:"my-appointments",
        component: () => import("@/views/patients/MyAppointmentsView.vue"),
      },
      {
        path:"",
        component: () => import("@/components/MenuPanel.vue"),
      },
      {
        path:"settings",
        component: () => import("@/views/all/ProfileView.vue")
      },
      {
        path:"appointments",
        component: () => import("@/views/doctor/ViewAppointments.vue"),
      },
      {
        path:"find-assistants",
        component:()=>import("@/views/doctor/GetAssistantView.vue")
      },
      {
        path:"emergency",
        component:()=>import("@/views/all/EmergencyView.vue")
      }
      // {
      //   path:"doctors/:id",
      //   component: () => import("@/views/doctor/ViewDoctorProfile.vue")
      // }
    ]
  },
  {
    path:"/register/patient",
    name:"register_patient",
    component: () => import("../views/register/RegisterPatientView.vue")
  },
  {
    path:"/crew/singup",
    name:"crew_singup",
    component: () => import("@/views/register/RegisterCrewView.vue")
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(), 
    (user) => {
      removeListener()
      resolve(user);
    }
    , reject);
  });
};

router.beforeEach(async(to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("you dont have access");
      next("/");
    }
  } else {
    next();
  }
});

export default router;
