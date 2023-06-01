import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDf5K0aeZnblkyn-cUiU09T9eKhlhI3Ojk",
  authDomain: "santo-chat.firebaseapp.com",
  projectId: "santo-chat",
  storageBucket: "santo-chat.appspot.com",
  messagingSenderId: "1050666193494",
  appId: "1:1050666193494:web:61d0edd93e355dd60ea1f7",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
