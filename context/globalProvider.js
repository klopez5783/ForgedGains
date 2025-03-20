import React, { createContext, useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

const GlobalContext = createContext({
  user: null,
  loading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Display Name Here", // ✅ Ensure displayName exists
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const updateUser = async (updatedUserData) => {
    try {
      //Check for valid user authentication
      if (!auth.currentUser){
        Alert.alert("Error", "You need to be logged in to update your profile.")
        return;
      }

      await updateProfile(auth.currentUser, updatedUserData); //Update the profile
      const updatedUser = {...user, ...updatedUserData} //Update the local state
      setUser(updatedUser);
      Alert.alert("Success!", "Your profile has been updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "There was an error updating your profile.  Please try again later.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000814" }}>
        <ActivityIndicator size="large" color="FFC300" />
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
