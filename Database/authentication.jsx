import { getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, serverTimestamp } from "firebase/auth";
import { app } from "../fireBaseConfig"; // Import your Firebase app instance
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth(app); // Get the authentication instance
const db = getFirestore(app);

// Function for signing up a new user
export const signup = async (email, password, firstName,
                                              height=0,
                                              bodyFat=0,
                                              weight=0,
                                              gender="Not Selected") => {
  try {
    // Create a new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Get the user object from the userCredential
    const user = userCredential.user;
    // Get the user's unique ID
    const uid = user.uid;


    //Add user to firestore.
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        firstName,
        height,
        bodyFat,
        weight,
        gender,
        email,
        bodyFatUpdatedAt: serverTimestamp(), // Timestamp for bodyFat
        weightUpdatedAt: serverTimestamp() // Timestamp for weight
    });


    // Optionally, use a Cloud Function to handle this to keep client-side logic minimal.

    return user; // Return user details
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already in use.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === "auth/invalid-email"){
        errorMessage = "Invalid email address provided."
    }
    console.error("Error signing up:", error);
    throw new Error(errorMessage);
  }
};

// Function for signing in an existing user
export const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }  catch (error) {
    let errorMessage = "Invalid login credentials.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    }
    throw new Error(errorMessage);
  }
};

export const sendPasswordReset = async (email) =>{
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent!");
    return { success: true };
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    }
    throw new Error(errorMessage);
  }
}

export const SignUserOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
  }
}
