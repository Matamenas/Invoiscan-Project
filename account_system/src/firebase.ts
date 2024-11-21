// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyBQ3XpNrUX1fxMOmsJGhDDQDcr8q8VjAEE",
    authDomain: "fir-app-b2e1c.firebaseapp.com",
    projectId: "fir-app-b2e1c",
    storageBucket: "fir-app-b2e1c.firebasestorage.app",
    messagingSenderId: "622568274870",
    appId: "1:622568274870:web:c5f58b34917a1578b09f17"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);