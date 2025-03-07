import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from '../fireBaseConfig';


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const addFitnessData = async(userData) =>{
    const user = auth.currentUser; // Get the currently logged-in user
    if (user) {
      try {
        // 1️⃣ Reference the user's document in the "users" collection
        const userDocRef = doc(db, "users", user.uid);
        console.log(userDocRef);
        
        // 2️⃣ Create a reference to the "fitnessData" subcollection inside the user's document
        //const fitnessDataCollectionRef = collection(userDocRef, "fitnessData");
        
        // 3️⃣ Add a new document to the "fitnessData" subcollection with userData
        //const newFitnessDataRef = await addDoc(fitnessDataCollectionRef, userData);
        
        // 4️⃣ Log the newly created document's ID
        console.log("Fitness data added with ID: ", newFitnessDataRef.id);
      } catch (error) {
        console.error("Error adding fitness data:", error);
      }
    } else {
      console.log("User not logged in.");
    }
  }
  

