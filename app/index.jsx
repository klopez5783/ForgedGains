import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Image, Modal, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBTN from '../components/CustomBTN';
import { images } from '../constants';
import { useGlobalContext } from '../context/globalProvider';
import "../global.css";

export default function App() {
  
  const {user,loading} = useGlobalContext();
  const router = useRouter();
  const [showMedicalDisclaimer, setShowMedicalDisclaimer] = useState(false);


  useEffect(() => {
    checkFirstLaunch();
  }, []);

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


  const checkFirstLaunch = async () => {
    try {
      const hasSeenDisclaimer = await AsyncStorage.getItem('hasSeenMedicalDisclaimer');
      if (!hasSeenDisclaimer) {
        setShowMedicalDisclaimer(true);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const acceptDisclaimer = async () => {
    try {
      await AsyncStorage.setItem('hasSeenMedicalDisclaimer', 'true');
      setShowMedicalDisclaimer(false);
    } catch (error) {
      console.error('Error saving disclaimer:', error);
    }
  };


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
        

        <Modal
          animationType="slide"
          transparent={true}
          visible={showMedicalDisclaimer}
          onRequestClose={() => {}} // Prevent dismissal
        >
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0,0,0,0.9)' 
          }}>
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 20, 
              padding: 25, 
              width: '85%',
              maxHeight: '80%'
            }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                textAlign: 'center',
                marginBottom: 15,
                color: '#DC2626'
              }}>
                ⚕️ Important Medical Notice
              </Text>

              <ScrollView style={{ maxHeight: 400 }}>
                <Text style={{ fontSize: 16, marginBottom: 12, lineHeight: 22 }}>
                  <Text style={{ fontWeight: 'bold' }}>Before You Begin:{'\n\n'}</Text>
                  Forged Fitness provides <Text style={{ fontWeight: 'bold' }}>educational calculations only</Text> based 
                  on established scientific formulas. This app:
                </Text>

                <Text style={{ fontSize: 14, marginLeft: 10, marginBottom: 10 }}>
                  ❌ Does NOT measure biological data{'\n'}
                  ❌ Does NOT use device sensors{'\n'}
                  ❌ Does NOT provide medical-grade accuracy{'\n'}
                  ❌ Does NOT replace medical advice
                </Text>

                <View style={{ 
                  backgroundColor: '#FEF3C7', 
                  padding: 12, 
                  borderRadius: 8,
                  marginVertical: 12
                }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#92400E', marginBottom: 5 }}>
                    ⚕️ Consult Your Doctor Before:
                  </Text>
                  <Text style={{ fontSize: 13, color: '#78350F', marginLeft: 10 }}>
                    • Starting any new diet plan{'\n'}
                    • Beginning an exercise program{'\n'}
                    • Making lifestyle changes{'\n'}
                    • If you have medical conditions
                  </Text>
                </View>

                <Text style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 10 }}>
                  Results are estimates and may vary based on individual metabolism, body composition, 
                  and measurement accuracy. Not guaranteed and should not be considered medical advice.
                </Text>
              </ScrollView>

              <Button 
                title="I Understand - Continue" 
                onPress={acceptDisclaimer}
                color="#059669"
              />
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}