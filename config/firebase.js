import * as firebase from "firebase";
import "@firebase/auth";
// 'use-strict';

// const firebase = require('firebase');
// const APP_BASE = 'https://your-unique-url.firebaseapp.com/'


const firebaseConfig = {
    apiKey: "AIzaSyBoEz4vk93gJW2tRAGNLbHYWScO9EHJrFs",
    authDomain: "ffxbet-af62f.firebaseapp.com",
    projectId: "ffxbet-af62f",
    storageBucket: "ffxbet-af62f.appspot.com",
    messagingSenderId: "132216029139",
    appId: "1:132216029139:web:20e1d410a03571b4f77926",
    measurementId: "G-Y8XX1FPTVZ"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export default firebase;