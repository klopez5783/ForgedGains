import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Redirect , router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import CustomBTN from '../components/CustomBTN';
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

const setupDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('forgedGains');
    // Enable Write-Ahead Logging (WAL) for better performance
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Users (userName TEXT PRIMARY KEY NOT NULL, 
                                        email TEXT NOT NULL,
                                        password TEXT NOT NULL);
    `);
    // Insert sample users (if needed)
    await db.execAsync(`
      INSERT OR IGNORE INTO Users (userName, email, password) VALUES 
      ("Xx_Slayer_xX", "slayer@email.com", "password123"),
      ("TheRealSlimShady", "shady@email.com", "password456");
  `);  

    console.log("Database setup completed successfully!");

    // Fetch all rows from the Users table
    const allRows = await db.getAllAsync('SELECT * FROM Users');
    for (const row of allRows) {
      console.log(row.userName, row.email);
    }
  } catch (err) {
    console.error("Database setup failed with error: " + err);
  }
};

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <LinearGradient
      colors={['#001433', '#000814']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View nativeID="IntroImageView" className="w-full justify-start items-center px-4 mt-5">
            <Image source={images.logoV4}
              className="w-[175px] h-[35vh]"
              resizeMode='contain' />
          </View>
          <View nativeID="introTextView" className='flex-1 justify-start px-4'>
            <Text nativeID="introText" className="text-2xl text-white font-bold text-center">
              <Text className='text-darkGold'>Forged Gains:</Text> Where Strength is Crafted and Limits are Broken. 
              Where ordinary is melted down and reforged into extraordinary. Are you ready to build the unbreakable?
            </Text>
            
          <CustomBTN width={250} 
          Title="I'm Ready."
          handlePress={() => router.push('/(auth)/sign-in')}
           />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}