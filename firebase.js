import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCR5Y1OdQ0CSmPwMiMj54PX0FfMXmuYS3s",
  authDomain: "solo-progress-app.firebaseapp.com",
  projectId: "solo-progress-app",
  storageBucket: "solo-progress-app.firebasestorage.app",
  messagingSenderId: "324078016670",
  appId: "1:324078016670:web:744a5a172e049aa1f7038f",
  measurementId: "G-8PWHV3KCCK"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// auto sign in
signInAnonymously(auth);
