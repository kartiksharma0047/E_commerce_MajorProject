import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzPdALRyJWTRLuzeA72SlG3RBgcmKx20g",
  authDomain: "e-commerce-9a6ad.firebaseapp.com",
  projectId: "e-commerce-9a6ad",
  storageBucket: "e-commerce-9a6ad.appspot.com",
  messagingSenderId: "1034023519826",
  appId: "1:1034023519826:web:6de2c91bb5eac53d4dc18b",
  measurementId: "G-699QP637WZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail };
