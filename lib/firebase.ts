import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq9x4HZPaOUppouJye_RA1RHCPcTtROXE",
  authDomain: "dee-graphics.firebaseapp.com",
  databaseURL: "https://dee-graphics-default-rtdb.firebaseio.com",
  projectId: "dee-graphics",
  storageBucket: "dee-graphics.firebasestorage.app",
  messagingSenderId: "711480611401",
  appId: "1:711480611401:web:f718b2df9515994ca06598",
  measurementId: "G-DE6E59FVZG",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const EMAILJS_SERVICE_ID = "service_ine4478";
export const EMAILJS_TEMPLATE_ID = "template_wq33fsp";
export const EMAILJS_PUBLIC_KEY = "Ly33KX1CpQWMAxOSv";
