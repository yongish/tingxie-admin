// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDFsiw6GwOaguJHmj7HBWv02nlsGfQkKE",
  authDomain: "tingxie-admin.firebaseapp.com",
  projectId: "tingxie-admin",
  storageBucket: "tingxie-admin.appspot.com",
  messagingSenderId: "1044706043973",
  appId: "1:1044706043973:web:417993f093300343af9b2c",
  measurementId: "G-9HFPD8BB23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
