import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVTQMDD39FgYFIkxjxUo5qPxZh6ZsMqRA",
  authDomain: "deskill.firebaseapp.com",
  projectId: "deskill",
  storageBucket: "deskill.firebasestorage.app",
  messagingSenderId: "905252218821",
  appId: "1:905252218821:web:5dc5cdd9e6e276cf468dac",
  measurementId: "G-H2YCLFXYEC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
