import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { sendPasswordReset } from '../../Database/authentication'


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
          router.push('/(auth)/sign-in') // Navigate to home screen after sign-up
        } catch (err) {
          alert(err.message);
        } finally {
          setIsSubmiting(false);
        }
      };

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
        <View className={`mx-auto justify-center px-4 my-6`}>

          <View className="mb-15 px-2 pt-10">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
              <AntDesign name="arrowleft" size={30} color="#FFC300" />
              <Text className="text-lg font-psemibold text-darkGold ml-2">Go Back</Text>
            </TouchableOpacity>
          </View>


            <View>
              <Image source={images.logoV4}
                className={"w-[175px] h-[35vh] mx-auto"}
                resizeMode='contain' />
            </View>
          
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
          otherStyles={"mt-4"}
          />


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}