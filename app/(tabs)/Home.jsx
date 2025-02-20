import { View, Text } from 'react-native'
import {React , useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import { SignUserOut } from '../../Database/authentication'
import { useNavigation, useRouter } from 'expo-router'
import { useGlobalContext } from "../../context/globalProvider"


export default function Home() {

  const { user } = useGlobalContext();

  const navigation = useNavigation();

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
      <View>
        <Text>
          { user ? `Welcome ${user.email}` : 'Not Logged In'}
        </Text>
      </View>
    </SafeAreaView>
  )
}
