import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images , icons } from '../../constants'
import FormField from '../../components/FormField'
import CustomBTN from '../../components/CustomBTN'
import { Link } from 'expo-router'
import { signin } from '../../Database/authentication'
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SignIn() {

  const router = useRouter();

  const [form , setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmiting , setIsSubmiting ] = useState(false);

  const handleSignIn = async() => {
    try {
      setIsSubmiting(true);
        await signin(form.email, form.password); // Call the signup function
        router.replace('/(tabs)/Home') // Navigate to home screen after sign-up
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
              <Text className="text-lg font-psemibold text-darkGold ml-2">Sign Up</Text>
            </TouchableOpacity>
          </View>


          <Image 
          source={images.logoV4} 
          className="w-[175px] h-[15vh] mx-auto mt-10" 
          resizeMode='contain' />
          
          <Text className="text-3xl text-darkGold font-bold mt-10">Sign In</Text>

          <FormField 
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email: e})}
          otherStyles="mt-7"
          keyboardType="email-address"
          />

          <FormField 
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({...form, password: e})}
          otherStyles="mt-4"
          />

          <CustomBTN
          Title="Sign In"
          width={300}
          handlePress={handleSignIn}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Forgot your password?
            </Text>
            <Link
              href="/resetPassword"
              className="text-lg font-psemibold text-darkGold"
            >
              <Text>Reset Password Here</Text>
            </Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}