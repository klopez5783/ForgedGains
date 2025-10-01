import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { auth } from "../fireBaseConfig"; // ✅ this is key

const GlobalContext = createContext({
  user: null,
  loading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GlobalProvider.jsx - Inside useEffect

   

const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    
    // --- SCENARIO 1: PERMANENT USER DETECTED ---
    // This runs if the user has an existing account (email/password, Google, etc.)
    if (firebaseUser) {
        const isGuest = firebaseUser.isAnonymous;
        
        // This handles both fully signed-in users AND returning anonymous users
        setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: isGuest 
                            ? "Guest" 
                            : firebaseUser.displayName || "Display Name Here",
            isAnonymous: isGuest,
        });
        
    } else {
        // --- SCENARIO 2: NO AUTHENTICATED USER DETECTED (Guest Session) ---
        // This runs if no Firebase token is found (initial load or after sign-out)
        try {
            // NOTE: You must leave signInAnonymous() commented out or removed.
            
            // Set up a temporary, non-Firebase-backed "session" user
            console.log("No user detected, setting guest state.");
            setUser({
                uid: null,          // 👈 KEY: No UID means no Firestore access
                email: null,
                displayName: "Guest",
                isAnonymous: true,  // Use this flag to control UI messages
            });
            
        } catch (error) {
            console.error("Session creation failed:", error);
            setUser(null); // Fallback if setting guest state fails
        }
    }
    
    setLoading(false);
});

    return () => unsubscribe();
  }, []);

  // GlobalProvider.jsx

  const updateUser = async (updatedUserData) => {
      // 1. Check if we have an AUTHENTICATED Firebase user object to update
      const isUpdatingAuth = auth.currentUser && updatedUserData.displayName; // Example check: only update auth if displayName is provided

      if (isUpdatingAuth) {
          // --- AUTHENTICATED PROFILE UPDATE PATH ---
          try {
              // Check again, as an extra layer of safety before the expensive call
              if (!auth.currentUser) {
                  Alert.alert("Error", "Authentication required to update profile.");
                  return;
              }
              await updateProfile(auth.currentUser, updatedUserData);
              
              // Success alert specific to profile updates
              Alert.alert("Success!", "Your profile has been updated successfully!");

          } catch (error) {
              console.error("Error updating Firebase profile:", error);
              Alert.alert("Error", "There was an error updating your Firebase profile.");
              return; // Stop here if Auth fails
          }
      } 
      
      // --- LOCAL/SESSION DATA UPDATE PATH (Runs for both Auth Users and Guests) ---
      
      // This merges the old state (user) with the new data (updatedUserData)
      // For a guest, this merges {uid: null} with {bmr: 2000, tdee: 2500, ...}
      const updatedUser = { ...user, ...updatedUserData };
      setUser(updatedUser);
      
      // Alert specific to guests/data updates (Only show if we didn't show the profile alert)
      if (!isUpdatingAuth) {
          // This is a generic success alert for data that was successfully merged into the session.
          // The more specific alert for guests is now handled in Calculator.js's useEffect.
          // We can safely remove the success alert from here to avoid conflicts.
      }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000814" }}>
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }

  return (
    <GlobalContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
