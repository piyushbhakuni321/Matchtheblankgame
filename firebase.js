// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpTeKlwAi1yPpJ1H7MK8M-ume_J54Mv2o",
  authDomain: "cognitiigame.firebaseapp.com",
  projectId: "cognitiigame",
  storageBucket: "cognitiigame.appspot.com", 
  messagingSenderId: "583001574530",
  appId: "1:583001574530:web:2526b08eff7e82c943789b",
  measurementId: "G-1TW06DDE7Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
