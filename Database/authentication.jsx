import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  serverTimestamp,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import { app, auth } from "../fireBaseConfig"; // Import your Firebase app instance


// const auth = getAuth(app); // Get the authentication instance
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

export const deleteCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;

      // 1. Delete user's data from Firestore
      console.log("Deleting Firestore documents for user:", uid);
      const userDocRef = doc(db, "users", uid);
      await deleteDoc(userDocRef);

      // (Optional) If you have a separate 'chats' collection, delete that as well
      const chatDocRef = doc(db, "chats", uid);
      await deleteDoc(chatDocRef);
      
      // 2. Delete the user from Firebase Authentication
      await deleteUser(user);

      console.log("User account and associated data deleted successfully.");
      
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error) {
    let errorMessage = "Failed to delete user account.";
    if (error.code === "auth/requires-recent-login") {
      errorMessage = "Please sign in again to delete your account.";
    }
    throw new Error(errorMessage);
  }
};


// ✅ New function to sign in an anonymous user
export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    console.log("Signed in anonymously with UID:", user.uid);
    return user;
  } catch (error) {
    console.error("Error during anonymous sign-in:", error);
    throw new Error("Failed to sign in anonymously.");
  }
};