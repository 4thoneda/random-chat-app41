// src/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3wZTanCdGxG6jpo39CkqUcM9LhK17BME",
  authDomain: "ajnabicam.firebaseapp.com",
  projectId: "ajnabicam",
  storageBucket: "ajnabicam.appspot.com",
  messagingSenderId: "558188110620",
  appId: "1:558188110620:web:500cdf55801d5b00e9d0d9",
  measurementId: "G-XM2WK7W95Q",
};

// ✅ Prevent duplicate app initialization
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Optional: analytics
let analytics: any = null;
if (import.meta.env.PROD) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export { firebaseApp, analytics };
