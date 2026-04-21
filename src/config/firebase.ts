import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
 apiKey: "AIzaSyCzvpFoVCDYcSAZFeoBoK1G-QKlmj45qco",
  authDomain: "verbalyst-f3c23.firebaseapp.com",
  projectId: "verbalyst-f3c23",
  storageBucket: "verbalyst-f3c23.firebasestorage.app",
  messagingSenderId: "232143433464",
  appId: "1:232143433464:web:af92851c03700705ba950d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
