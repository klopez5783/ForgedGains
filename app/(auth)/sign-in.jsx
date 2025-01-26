import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomBTN from '../../components/CustomBTN'
import { Link } from 'expo-router'

export default function SignIn() {

  const [form , setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmiting , setIsSubmiting ] = useState(false);

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] px-4 my-6">

          <Image 
          source={images.logoV4} 
          className="w-[175px] h-[15vh] mx-auto" 
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
          handlePress={isSubmiting}
          
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-darkGold"
            >
              Signup
            </Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}