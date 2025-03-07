// Import the functions you need from the SDKs you need
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO9xAs6WVRQr0ZaPi7K68znTYgqs_ZgvQ",
  authDomain: "forgedgains-bdcd3.firebaseapp.com",
  projectId: "forgedgains-bdcd3",
  storageBucket: "forgedgains-bdcd3.firebasestorage.app",
  messagingSenderId: "43132918934",
  appId: "1:43132918934:web:9a134e496a4dea3d9836b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Sign Up function
export const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export { onAuthStateChanged };
