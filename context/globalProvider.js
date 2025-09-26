import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { signInAnonymous } from "../Database/authentication";
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: isGuest 
                       ? "Guest" 
                       : firebaseUser.displayName || "Display Name Here",
        isAnonymous: isGuest
    });
      } else {
        // No user found, sign in anonymously
        try {
          const anonymousUser = await signInAnonymous();
          setUser({
            uid: anonymousUser.uid,
            email: null, // Anonymous users don't have an email
            displayName: "Guest", // Or any other guest-like name
            isAnonymous: true,
          });
        } catch (error) {
          console.error("Anonymous sign-in failed:", error);
          setUser(null); // Set user to null if anonymous sign-in fails
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = async (updatedUserData) => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Error", "You need to be logged in to update your profile.");
        return;
      }

      await updateProfile(auth.currentUser, updatedUserData);
      const updatedUser = { ...user, ...updatedUserData };
      setUser(updatedUser);
      Alert.alert("Success!", "Your profile has been updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "There was an error updating your profile. Please try again later.");
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
