import { View, Text, ScrollView, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { images } from '../constants';
import FormField from '../components/FormField';
import CustomBTN from '../components/CustomBTN';

export default function bodyFat() {

  return (
  // <SafeAreaView className="bg-backGround h-full">
  //   <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={50} >
  //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  //         <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">


  //           <View className="w-full flex flex-row items-center justify-center mt-5 border-b-2 border-darkGold pb-2">
  //             <Text className="text-darkGold-100 self-center text-3xl font-psemibold mr-2">Grab a measuring tape</Text>
  //             <MaterialCommunityIcons name="tape-measure" size={35} color="white" className="self-center" /> 
  //           </View>

  //           <View>
  //             <Text className="text-white text-2xl font-psemibold self-center mt-6">Measuring your waist</Text>
  //             <View className="items-center mt-4">
  //               <Text className="text-white text-lg font-psemibold w-96 mt-2">1. Locate the narrowest part of your torso, just above your belly button.</Text>
  //               <Text className="text-white text-lg font-psemibold w-96 mt-2">2. Stand upright and wrap the tape around your waist.</Text>
  //               <Text className="text-white text-lg font-psemibold w-96 mt-2">3. Keep it level and snug, but not too tight.</Text>
  //             </View>

  //             <View data-id="WaistImage">
  //               <Image
  //               source={images.MeasuringWaist}
  //               className="w-4/5 h-[33vh] self-center"
  //               resizeMode='contain' 
  //               />
  //               <FormField
  //               placeholder="Enter measurement in inches"
  //               keyboardType="numeric"
  //               />
  //             </View>


  //             <CustomBTN
  //             Title="Next"
  //             otherStyles="self-center mt-4 w-4/5"
  //             width={250}
  //             />
                
  //           </View>
  //         </ScrollView>
  //     </TouchableWithoutFeedback>
  //   </KeyboardAvoidingView>
  // </SafeAreaView>
  <SafeAreaView className="bg-backGround h-full flex-1">
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full flex flex-row items-center justify-center mt-5 border-b-2 border-darkGold pb-2">
          <Text className="text-darkGold-100 self-center text-3xl font-psemibold mr-2">
            Grab a measuring tape
          </Text>
          <MaterialCommunityIcons
            name="tape-measure"
            size={35}
            color="white"
            className="self-center"
          />
        </View>

        <View>
          <Text className="text-white text-2xl font-psemibold self-center mt-6">
            Measuring your waist
          </Text>
          <View className="items-center mt-4">
            <Text className="text-white text-lg font-psemibold w-96 mt-2">
              1. Locate the narrowest part of your torso, just above your belly button.
            </Text>
            <Text className="text-white text-lg font-psemibold w-96 mt-2">
              2. Stand upright and wrap the tape around your waist.
            </Text>
            <Text className="text-white text-lg font-psemibold w-96 mt-2">
              3. Keep it level and snug, but not too tight.
            </Text>
          </View>

          <View data-id="WaistImage">
            <Image
              source={images.MeasuringWaist}
              className="w-4/5 h-[33vh] self-center"
              resizeMode="contain"
            />
            {/* Wrap input field in a View with padding to avoid cutoff */}
            <View className="">  
              <FormField
                placeholder="Enter measurement in inches"
                keyboardType="numeric"
              />
            </View>
          </View>

          <CustomBTN
            Title="Next"
            otherStyles="self-center mt-4 w-4/5"
            width={250}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
</SafeAreaView>

    )
}

