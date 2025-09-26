import AntDesign from '@expo/vector-icons/AntDesign'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { signin } from '../../Database/authentication'

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
      <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={10}
                style={{ flex: 1 }}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView>
        <View className="mx-auto justify-center px-4 my-6">

          <View className="mb-15 px-2 pt-10">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
              <AntDesign name="arrowleft" size={Platform.isPad ? 40 : 30} color="#FFC300" />
              <Text className={Platform.isPad ? "text-2xl font-psemibold text-darkGold ml-2" : "text-lg font-psemibold text-darkGold ml-2"}>Go Back</Text>
            </TouchableOpacity>
          </View>


          <Image 
          source={images.logoV4} 
          className={Platform.isPad ? "w-[250px] h-[30vh] mx-auto mt-5" : "w-[175px] h-[15vh] mt-5 mx-auto"}
          resizeMode='contain' />
          
          <Text className="text-3xl text-darkGold font-bold">Sign In</Text>

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
          width={Platform.isPad ? 400 : 300}
          handlePress={handleSignIn}
          otherStyles={Platform.isPad ? "mt-6" : "mt-4"}
          />

          {Platform.isPad ? (
            <View className="flex justify-center pt-4 flex-row gap-2">
              <Text className="text-2xl text-gray-100 font-pregular">
                Forgot your password?
              </Text>
              <Link
                href="/resetPassword"
                className="text-2xl font-psemibold text-darkGold"
              >
                <Text>Reset Password Here</Text>
              </Link>
            </View>
          ) : (
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
          )}

        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}