import { View, Text } from 'react-native'
import {React , useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import { SignUserOut } from '../../Database/authentication'
import { useNavigation, useRouter } from 'expo-router'


export default function Home() {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // Disable swipe-back gesture
    });
  }, [navigation]);

  const router = useRouter();

  const handleSignOut = async() => {
  try {
    console.log("Signing Out...");
    await SignUserOut();
    router.replace('/(auth)/sign-in')
  }catch(err){
    alert(err.message)
  }
}

  return (
    <SafeAreaView>
      <Text>
        Home
      </Text>
      <CustomBTN
      Title="Sign Out"
      handlePress={ handleSignOut }
      width={200}
      />
    </SafeAreaView>
  )
}
