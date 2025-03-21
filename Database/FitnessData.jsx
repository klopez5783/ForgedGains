import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../fireBaseConfig";



export const getUserData = async (user) => {
  try {

    if (!user) {
      console.log("No user is signed in.");
      return null;
    }

    console.log("User Logged in\nFetching user data...");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("User data:", userSnap.data());
      return userSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};


export const updateFitnessData = async (user, updatedFitnessData) => {
  try {
    if (!user) {
      console.log("No user is signed in.");
      return;
    }

    console.log("Updating fitness data for:", user.uid);

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      bodyFat: updatedFitnessData.BodyFat,
      weight: updatedFitnessData.Weight,
      height: updatedFitnessData.Height,
      age: updatedFitnessData.Age,
      gender: updatedFitnessData.Gender
    });

    console.log("Fitness data updated successfully!");
  } catch (error) {
    console.error("Error updating fitness data:", error);
  }
};
