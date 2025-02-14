import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomBTN from '../../components/CustomBTN'
import * as ExpoCrypto from 'expo-crypto';
import CryptoJS from 'crypto-js';
import { useSQLiteContext } from 'expo-sqlite';
import { signup } from '../../Database/authentication';
import { useRouter } from 'expo-router';


async function generateSalt() {
  console.log("Generating salt...");
  const randomBytes = await ExpoCrypto.getRandomBytesAsync(16);
  const salt = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(randomBytes));
  console.log("Generated Salt:", salt);
  return salt;
}

async function hashPassword(password) {
  if (!password) {
    throw new Error("Password is undefined");
  }
  console.log("Hashing Password...");
  const salt = await generateSalt();
  const hash = CryptoJS.SHA256(password + salt).toString();
  console.log("Hashed Password:", hash);
  return { hash, salt };
}




export default function SignUp() {

  const db = useSQLiteContext();
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

    // Hash the password
    console.log("Hashing Password...");
    // try {
    //   const { hash, salt } = await hashPassword(form.password); // ⬅️ Await the result

    //   // Now pass the hashed password & salt to createUser
    //   //await addUser(db, form.email, form.userName, hash);

    // } catch (err){
    //   console.error("Error hashing password:", err);
    //   setIsSubmiting(false);
    // }

    try {
      await signup(form.email, form.password); // Call the signup function
      router.push('/sign-in'); // Navigate to home screen after sign-up
    } catch (err){
      console.error("Error hashing password:", err);
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
          

          </View>
        </ScrollView>
      </SafeAreaView>
  )
}