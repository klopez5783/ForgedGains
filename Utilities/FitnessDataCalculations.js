// utils/calculator.js (or similar file)

/**
 * Calculates BMR, TDEE, and Macros from form data for guest sessions.
 * NOTE: This function requires the client-side 'calculateBMR' function to be imported.
 * * @param {object} updatedFitnessData - The form data object from the calculator screen.
 * @returns {object|null} An object containing all calculated fitness metrics and form data, 
 * or null if input is invalid.
 */


const calculateBMR = (gender, weightLbs, heightInches, age) => {
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;

  if (gender === "Male") {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }
};
export const calculateGuestData = (updatedFitnessData) => {
    console.log("*".repeat(20));
    console.log("Calculating guest data for:", updatedFitnessData);
    console.log("*".repeat(20));
    // 1. INPUT PARSING AND VALIDATION (Identical to your updateFitnessData)
    const weight = parseFloat(updatedFitnessData.Weight);
    const age = parseInt(updatedFitnessData.Age);
    
    // Assuming height is passed as "X'Y" (e.g., "5'10")
    let heightFeetArr = updatedFitnessData.height.split("'");
    let heightFeet = parseInt(heightFeetArr[0]);
    let heightInches = parseInt(heightFeetArr[1]) || 0;
    const heightTotalInches = heightFeet * 12 + heightInches;

    // Perform a check to ensure all values are valid numbers
    if (isNaN(weight) || isNaN(age) || isNaN(heightFeet) || isNaN(heightTotalInches)) {
        console.error("One or more input values are not valid numbers for calculation.");
        return null;
    }

    // 2. Calculate BMR (You must import or define your calculateBMR function here)
    // IMPORTANT: Assuming 'calculateBMR' is available in this scope.
    const bmr = calculateBMR(
        updatedFitnessData.Gender, 
        weight, 
        heightTotalInches, 
        age
    );
    
    // 3. Define activity level multipliers and calculate TDEE
    const activityMultipliers = {
        'Sedentary': 1.2,
        'Slightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Super Active': 1.9, // Added 'Super Active' for completeness if you use it
    };
    
    // Normalize activity level key for lookup, defaulting to moderate
    const activityKey = updatedFitnessData.ActivityLevel.toLowerCase().replace(/\s/g, '');
    const tdee = bmr * (activityMultipliers[activityKey] || 1.55);

    // 4. Calculate macros for a 500 calorie deficit
    const calorieGoal = tdee - 500;
    const protein = Math.round((calorieGoal * 0.3) / 4); // 30% from protein
    const fats = Math.round((calorieGoal * 0.25) / 9); // 25% from fats
    const carbs = Math.round((calorieGoal * 0.45) / 4); // 45% from carbs

    // 5. Return a unified object with the base form data and results
    const calculatedData = {
        ...updatedFitnessData,
        weight: weight,
        age: age,
        height: updatedFitnessData.height, // Keep original height string for display
        
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        protein: protein,
        fats: fats,
        carbs: carbs,
        
        // Ensure that any necessary default timestamps are included, 
        // but set to null/empty string since we are not using serverTimestamp()
        bodyFatUpdatedAt: null, 
        weightUpdatedAt: null,
    };

    console.log("Guest Calculated Data:", calculatedData);
    return calculatedData;
};


