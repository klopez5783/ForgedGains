import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomBTN from '../../components/CustomBTN'
import { signup } from '../../Database/authentication';
import { useRouter , Link } from 'expo-router';

export default function SignUp() {
  const router = useRouter();

  const [form , setForm] = useState({
    userName : '',
    email: '',
    confirmPassword: '',  
    password: ''
  });

  const [isSubmiting , setIsSubmiting ] = useState(false);

  const handleSignUp = async() => {
    console.log("Signing Up...");
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

    try {
      setIsSubmiting(true);
      await signup(form.email, form.password); // Call the signup function
      router.push('/sign-in'); // Navigate to home screen after sign-up
    } catch (err) {
      alert(err.message);
    }finally{
      setIsSubmiting(false);
    }
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

            {/* <FormField 
            title="Username"
            value={form.userName}
            handleChangeText={(e) => setForm({...form, userName: e})}
            otherStyles="mt-7"
            keyboardType="default"
            /> */}

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

          <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Already have an account?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-darkGold"
              >
                Sign in
              </Link>
            </View>
          

          </View>
        </ScrollView>
      </SafeAreaView>
  )
}