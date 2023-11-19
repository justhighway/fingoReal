// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDk-7BUxfppJckeZFGuA1EV8xMiFyMfn0k",
  authDomain: "fingo123.firebaseapp.com",
  projectId: "fingo123",
  storageBucket: "fingo123.appspot.com",
  messagingSenderId: "166536804864",
  appId: "1:166536804864:web:605fb3acd221f750a2b6e5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
