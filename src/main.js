import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCmGKDZbrxKjVkt_p6xZO6za8U1mMUtkoM",
  authDomain: "hmo-app-15266.firebaseapp.com",
  projectId: "hmo-app-15266",
  storageBucket: "hmo-app-15266.appspot.com",
  messagingSenderId: "1055680444219",
  appId: "1:1055680444219:web:7fbd0ade34dd5bd43ba91e",
  measurementId: "G-Q2X9LQ9XGM"
};



const app = createApp(App)
const firebaseApp = initializeApp(firebaseConfig);

getFirestore(firebaseApp);

app.use(store)
app.use(router)
app.use()



/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(fas)

app.component('font-awesome-icon', FontAwesomeIcon)

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

app.component('Datepicker', Datepicker);



import Toaster from "@meforma/vue-toaster";

app.use(Toaster)



app.mount('#app')





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCmGKDZbrxKjVkt_p6xZO6za8U1mMUtkoM",
//   authDomain: "hmo-app-15266.firebaseapp.com",
//   projectId: "hmo-app-15266",
//   storageBucket: "hmo-app-15266.appspot.com",
//   messagingSenderId: "1055680444219",
//   appId: "1:1055680444219:web:7fbd0ade34dd5bd43ba91e",
//   measurementId: "G-Q2X9LQ9XGM"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);