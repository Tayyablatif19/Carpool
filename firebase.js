// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBoXwxFZ3OatQtThPn3m4GQpDL9D1Ng-PE",
  authDomain: "unicarpool19.firebaseapp.com",
  projectId: "unicarpool19",
  storageBucket: "unicarpool19.appspot.com", 
  messagingSenderId: "609243896460",
  appId: "1:609243896460:web:80ddbe49964af94f7379a9",
  measurementId: "G-H9M6971EDG"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);
