import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../fireBaseConfig"; // Import your Firebase app instance

const auth = getAuth(app); // Get the authentication instance

// Function for signing up a new user
export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return user details
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already in use.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    }
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

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Password reset email sent.";
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    }
    throw new Error(errorMessage);
  }
}
