import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { useEffect } from "react";
import { SQLiteProvider } from "expo-sqlite";

SplashScreen.preventAutoHideAsync();

const setupDatabase = async (db) => {
  try {
    await db.execAsync("DROP TABLE IF EXISTS Users;");
    const response = await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Users (userName TEXT PRIMARY KEY NOT NULL, 
                                        email TEXT NOT NULL,
                                        password TEXT NOT NULL);
    `);
    // Enable Write-Ahead Logging (WAL) for better performance
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
    // Insert sample users (if needed)
  //   await db.execAsync(`
  //     INSERT OR IGNORE INTO Users (userName, email, password) VALUES 
  //     ("Xx_Slayer_xX", "slayer@email.com", "password123"),
  //     ("TheRealSlimShady", "shady@email.com", "password456");
  // `);

    console.log("Database setup completed successfully!");

    // Fetch all rows from the Users table
    const allRows = await db.getAllAsync("SELECT * FROM Users");
    for (const row of allRows) {
      console.log(row.userName, row.email);
    }
  } catch (err) {
    console.error("Database setup failed with error: " + err);
  }
};

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded && !error) return null;

  return (
    <>
      <SQLiteProvider databaseName="forgedGains" version="1.0" onInit={setupDatabase}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </>
  );
}
