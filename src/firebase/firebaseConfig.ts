// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhcYWmXLg-J41wtvlR9UxcJ3yWaGfNeH4",
  authDomain: "patient-potraits.firebaseapp.com",
  projectId: "patient-potraits",
  storageBucket: "patient-potraits.appspot.com",
  messagingSenderId: "199919364553",
  appId: "1:199919364553:web:90592292449e6d2c31a018",
  measurementId: "G-YQ9VRWEK1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;