import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBTN from '../components/CustomBTN';
import { images } from '../constants';
import { useGlobalContext } from '../context/globalProvider';
import "../global.css";

export default function App() {
  
  const {user,loading} = useGlobalContext();
  const router = useRouter();

  // 1. Show Loading while user status is determined
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000814" }}>
        {/* You need to import ActivityIndicator from 'react-native' or similar */}
        {/* <ActivityIndicator size="large" color="#FFC300" /> */}
        <Text style={{color: '#FFC300'}}>Loading...</Text>
      </View>
    );
  }
  
  // 2. Redirect permanent users immediately after loading is done
  // If the user exists AND they are NOT anonymous, redirect.
  if (user && !user.isAnonymous) {
    // A slight delay (0ms is fine) is good practice for navigation calls
    // to ensure the component is fully mounted/ready.
    setTimeout(() => {
      router.replace("/Home"); // Use the simple path /Home
    }, 1);
    
    // Return null or a blank screen to prevent flashing the intro content 
    // while the redirect happens.
    return null; 
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
              handlePress={() => router.push('/(tabs)/Home')}
              otherStyles="mt-5"
              />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}