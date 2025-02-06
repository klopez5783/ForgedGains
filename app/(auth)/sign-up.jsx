import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomBTN from '../../components/CustomBTN'
import { Link } from 'expo-router'



export default function SignUp() {

  const [form , setForm] = useState({
    userName : '',
    email: '',
    confirmPassword: '',  
    password: ''
  });

  const [isSubmiting , setIsSubmiting ] = useState(false);

  const handleSignUp = () => {
    setIsSubmiting(true);

    // Password requirements
    const passwordRequirements = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number

    if (form.password !== form.confirmPassword) {
      setIsSubmiting(false);
      alert("Passwords do not match!");
      return;
    }

    if (!passwordRequirements.test(form.password)) {
      setIsSubmiting(false);
      alert("Password must be at least 8 characters long and include at least one letter and one number.");
      return;
    }

    // Add your sign-up logic here
  };

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] px-4 my-6">

          <Image 
          source={images.logoV4} 
          className="w-[175px] h-[15vh] mx-auto" 
          resizeMode='contain' />
          
          <Text className="text-3xl text-darkGold font-bold mt-10">Sign Up for Forged Fitness</Text>

          <FormField 
          title="Username"
          value={form.userName}
          handleChangeText={(e) => setForm({...form, userName: e})}
          otherStyles="mt-7"
          keyboardType="default"
          />

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

          <FormField 
          title="Confirm Password"
          value={form.confirmPassword}
          handleChangeText={(e) => setForm({...form, confirmPassword: e})}
          otherStyles="mt-4"
          />

          <CustomBTN
          Title="Sign Up"
          width={300}
          handlePress={handleSignUp}
          
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}