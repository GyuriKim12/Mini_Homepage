// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKlw7oeU-be19bb3aewaCws55c5c_59Po",
    authDomain: "minihompage.firebaseapp.com",
    databaseURL: "https://minihompage-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "minihompage",
    storageBucket: "minihompage.appspot.com",
    messagingSenderId: "169735811674",
    appId: "1:169735811674:web:b99b27a46594a18c3b9e63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app)
export const storage = getStorage(app)

export default app;