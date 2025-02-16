import { View, Text, ScrollView} from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import FormField from '../../components/FormField'
import CustomBTN from '../../components/CustomBTN'
import { sendPasswordReset } from '../../Database/authentication'
import { images } from '../../constants'


export default function resetPassword() {

    const router = useRouter();

    const [form , setForm] = useState({
      email: ''
    });
  
    const [isSubmiting , setIsSubmiting ] = useState(false);
  
    const handleReset = async() => {
      try {
        setIsSubmiting(true);
        console.log(form.email);
          const response = await sendPasswordReset(form.email); // Call the signup function
          if(response.success) alert("Password reset email sent successfully!");
          router.push('/(tabs)/Home') // Navigate to home screen after sign-up
        } catch (err) {
          alert(err.message);
        } finally {
          setIsSubmiting(false);
        }
      };

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
        <View className="w-full justify-center px-4 my-6">

          <View className="mb-15 px-2 pt-10">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
              <AntDesign name="arrowleft" size={30} color="#FFC300" />
              <Text className="text-lg font-psemibold text-darkGold ml-2">Sign In</Text>
            </TouchableOpacity>
          </View>


          <Image 
          source={images.logoV4} 
          className="w-[175px] h-[15vh] mx-auto mt-10" 
          resizeMode='contain' />
          
          <Text className="text-3xl text-darkGold font-bold mt-10">Reset Password</Text>

          <FormField 
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email: e})}
          otherStyles="mt-5"
          keyboardType="email-address"
          />

          <CustomBTN
          Title="Reset Password"
          width={300}
          handlePress={handleReset}
          />


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}