import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import CustomBTN from '../components/CustomBTN';
import { useGlobalContext } from '../context/globalProvider';
import React, { useState, useEffect} from 'react';
import {getUserData} from '../Database/FitnessData';


export default function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useGlobalContext();
  const router = useRouter();
  
  // useEffect(() => {
  //   if (user) {
  //     getUserData(user)
  //       .then((data) => {
  //         setUserData(data);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setError(err);
  //         setLoading(false);
  //       });
  //   }
  // }, [user]);
   // *Crucially* depend on the 'user' object from the context
  
  if(user) {
    console.log("Redirecting to Home Page...")
    console.log("Index Page \nUser: ", user);
    console.log("Fetching User Data...");
    getUserData(user);
    setTimeout(() => {
    router.replace("/(tabs)/Home");
    }, 100);
  }

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
          <View nativeID="introTextView" className='flex-1 justify-start '>
            <Text nativeID="introText" className="text-2xl text-white font-bold text-center">
              <Text className='text-darkGold'>Forged Gains:</Text> Where Strength is Crafted and Limits are Broken. 
              Where ordinary is melted down and reforged into extraordinary. Are you ready to build the unbreakable?
            </Text>
            
          <CustomBTN width={250} 
          Title="I'm Ready."
          handlePress={() => router.push('/(auth)/sign-up')}
          otherStyles="mt-5"
           />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}