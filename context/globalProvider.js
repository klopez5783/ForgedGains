import React, { createContext, useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GlobalContext.Provider value={{ user, loading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
