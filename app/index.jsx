import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBTN from '../components/CustomBTN';
import { images } from '../constants';
import { useGlobalContext } from '../context/globalProvider';
import "../global.css";

export default function App() {
  
  const {user, loading} = useGlobalContext();
  const router = useRouter();

  // If the provider is still loading, show a loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000814" }}>
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }
  
  if(user) {
    setTimeout(() => {
    router.replace("/(tabs)/Home");
    }, 1);
  }

  return (
      <LinearGradient
        colors={['#001433', '#000814']}
        style={{ flex: 1 }}
      >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View nativeID="IntroImageView" className="w-full justify-start items-center px-4 mt-5">
            {Platform.isPad ?
             <View>
                <Image source={images.logoV4}
                className="w-[275px] h-[40vh]"
                resizeMode='contain' />
             </View>
              :(
              <Image source={images.logoV4}
              className="w-[175px] h-[35vh]"
              resizeMode='contain' />
              )}
          </View>
          {Platform.isPad ? (
            <View nativeID="introTextView" className='flex-1 justify-start w-4/5 mx-auto'>
            <Text nativeID="introText" className="text-3xl text-white font-bold text-center">
              <Text className='text-darkGold'>Forged Gains:</Text> Where Strength is Crafted and Limits are Broken. 
              Where ordinary is melted down and reforged into extraordinary. Are you ready to build the unbreakable?
            </Text>
            
              <CustomBTN width={350} 
              Title="I'm Ready."
              handlePress={() => router.push('/(auth)/sign-up')}
              otherStyles="mt-10 text-pbold"
              textStyles="text-xl "
              />
          </View>
          ) : (
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
          )}
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}