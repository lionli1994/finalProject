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



const firebaseApp = initializeApp(firebaseConfig);

const db =getFirestore(firebaseApp);

export{
    db
}