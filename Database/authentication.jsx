import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../fireBaseConfig"; // Import your Firebase app instance

const auth = getAuth(app); // Get the authentication instance

// Function for signing up a new user
export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return user details
  } catch (error) {
    console.error("Signup Error:", error.message);
    throw error; // Propagate error
  }
};

// Function for signing in an existing user
export const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Signin Error:", error.message);
    throw error;
  }
};
