import AntDesign from '@expo/vector-icons/AntDesign'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { signup } from '../../Database/authentication'


export default function SignUp() {
  const router = useRouter();

  const [form , setForm] = useState({
    firstName : '',
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
      await signup(form.email, form.password,form.firstName); // Call the signup function
      router.push('/sign-in'); // Navigate to home screen after sign-up
    } catch (err) {
      alert("Error Signing Up:"+ err.message);
    }finally{
      setIsSubmiting(false);
    }
  };

  return (
      <SafeAreaView className="bg-backGround h-full">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView>
          <View className="mx-auto justify-center min-h-[70vh] px-4 my-6">


            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
              <AntDesign name="arrowleft" size={Platform.isPad ? 40 : 30} color="#FFC300" />
              <Text className={Platform.isPad ? "text-2xl font-psemibold text-darkGold ml-2" : "text-lg font-psemibold text-darkGold ml-2"}>Go Back</Text>
            </TouchableOpacity>

            
            <Image 
            source={images.logoV4} 
            className={Platform.isPad ? "w-[225px] h-[20vh] mx-auto" : "w-[175px] h-[15vh] mx-auto"}
            resizeMode='contain' />

            
            
            <Text className="text-3xl text-darkGold font-bold mt-10">Sign Up for Forged Fitness</Text>

            <FormField 
            title="First Name"
            value={form.firstName}
            handleChangeText={(e) => setForm({...form, firstName: e})}
            otherStyles="mt-7"
            keyboardType="default"
            />

            <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-4"
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
          width={Platform.isPad ? 400 : 300}
          handlePress={handleSignUp}
          otherStyles={Platform.isPad ? "mt-6" : "mt-4"}
          />

          { Platform.isPad ? (
            <View className="flex justify-center pt-4 flex-row gap-2">
              <Text className="text-2xl text-gray-100 font-pregular">
                Already have an account?
              </Text>
              <Link
                href="/sign-in"
                className="text-2xl font-psemibold text-darkGold"
              >
                Sign in
              </Link>
            </View>
          ) : (
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
          )}
          

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}