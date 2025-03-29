import { View, ActivityIndicator, Text, ScrollView } from 'react-native'
import {React , useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import { SignUserOut } from '../../Database/authentication'
import { useRouter } from 'expo-router'
import { useGlobalContext } from "../../context/globalProvider"
import {getUserData} from '../../Database/FitnessData';



export default function Home() {

  const router = useRouter();

  const {user} = useGlobalContext();

 
const [userFitnessData, setUserFitnessData] = useState(null);

const [loading, setLoading] = useState(true); // Track loading state

useEffect(() => {
  const fetchUserData = async () => {
    if (user) {
      try {
        const data = await getUserData(user);
        if (data) {
          setUserFitnessData({
            firstName: data.firstName || "User",
            age: data.age || "",
            gender: data.gender || "",
            weight: data.weight || "",
            height: data.height || "",
          });
          setLoading(false); // Mark loading as complete
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  fetchUserData();
}, [user]); // Runs when `user` changes



useEffect(() => {
  console.log("User Fitness Data Set:", userFitnessData);
}, [userFitnessData]); // Logs when `userFitnessData` changes

  const handleSignOut = async() => {
  try {
    console.log("Signing Out...");
    await SignUserOut();
    router.replace('/')
  }catch(err){
    alert(err.message)
  }
}

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
      <Text>
        Home
      </Text>
      <CustomBTN
      Title="Sign Out"
      handlePress={ handleSignOut }
      width={200}
      />
        <View className="flex-1 justify-center items-center">
        {loading ? (
          <ActivityIndicator size="large" className="mt-5" color="#FFC300" />
        ) : (
          <Text className="text-2xl text-white font-bold text-center mt-5">
            Welcome {userFitnessData?.firstName || "User"}
          </Text>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}
