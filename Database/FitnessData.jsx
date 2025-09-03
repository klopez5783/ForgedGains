import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig";



export const getUserData = async (user) => {
  try {

    if (!user) {
      console.log("No user is signed in.");
      return null;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
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


// ✅ New helper function for BMR calculation
const calculateBMR = (gender, weightLbs, heightInches, age) => {
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;

  if (gender === "Male") {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }
};


export const updateFitnessData = async (user, updatedFitnessData) => {
  try {
    if (!user) {
      console.log("No user is signed in.");
      return;
    }

    // ✅ Convert all inputs to numbers first
    const weight = parseFloat(updatedFitnessData.Weight);
    const age = parseInt(updatedFitnessData.Age);
    let heightFeetArr = updatedFitnessData.Height.split("'");
    let heightFeet = parseInt(heightFeetArr[0]);
    let heightInches = parseInt(heightFeetArr[1]) || 0;
    const heightTotalInches = heightFeet * 12 + heightInches;

    // ✅ Perform a check to ensure all values are valid numbers
    if (isNaN(weight) || isNaN(age) || isNaN(heightFeet) || isNaN(heightTotalInches)) {
      console.error("One or more input values are not valid numbers.");
      return;
    }

    // 2. Calculate BMR with the now-numeric values
    const bmr = calculateBMR(
      updatedFitnessData.Gender, 
      weight, 
      heightTotalInches, 
      age
    );
    
    // 3. Define activity level multipliers and calculate TDEE
    const activityMultipliers = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      superActive: 1.9,
    };
    const tdee = bmr * (activityMultipliers[updatedFitnessData.ActivityLevel] || 1.55); // Default to moderate if not found

    // 4. Calculate macros for a 500 calorie deficit for weight loss
    const calorieGoal = tdee - 500;
    const protein = Math.round((calorieGoal * 0.3) / 4); // 30% from protein
    const fats = Math.round((calorieGoal * 0.25) / 9); // 25% from fats
    const carbs = Math.round((calorieGoal * 0.45) / 4); // 45% from carbs

    console.log("Updating fitness data for:", user.uid);
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    const dataToUpdate = {
      ...updatedFitnessData,
      weight: weight,
      age: age,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      protein: protein,
      fats: fats,
      carbs: carbs,
      bodyFatUpdatedAt: serverTimestamp(),
      weightUpdatedAt: serverTimestamp(),
    };

    console.log("*".repeat(50));
    console.log("\n\nData to be updated in Firestore: ", dataToUpdate,"\n\n");
    console.log("BMR:", bmr, "TDEE:", typeof(tdee), "Protein:", protein, "Fats:", fats, "Carbs:", carbs);
    console.log("*".repeat(50));
    
    // ... (Your Firestore setDoc/updateDoc logic here)
    if (docSnap.exists()) {
       await updateDoc(userRef, dataToUpdate);
    } else {
       await setDoc(userRef, dataToUpdate);
    }
  } catch (error) {
    console.error("Error updating fitness data:", error);
  }
};