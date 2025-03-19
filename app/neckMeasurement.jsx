import { View, Text, ScrollView, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { images } from '../constants';
import FormField from '../components/FormField';
import CustomBTN from '../components/CustomBTN';
import { useRoute } from '@react-navigation/native';
import {convertToInches} from '../Utilities/heightCalulations';

export default function neckMeasurement() {
    const route = useRoute(); 
    const navigation = useNavigation();

    const { form , waist } = route.params;
    const [neck, setNeck] = useState("");

  const calculateBodyFat = () => {
    const waistNum = parseFloat(waist);
    const neckNum = parseFloat(neck);
    const heightNum = convertToInches(form.Height) == "Invalid height Format" ? null : convertToInches(form.Height);
    const bodyFat = 86.010 * Math.log10(waistNum - neckNum) 
                  - 70.041 * Math.log10(heightNum) 
                  + 36.76;
    console.log("Navigating to Start");
    console.log("Form Data:", form);
    navigation.navigate("(tabs)", { screen: "Start", params: { form , bodyFat } });
  };

  return (
    <SafeAreaView className="bg-backGround h-full flex-1">
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={10}
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
              Measuring your Nexk
            </Text>
            <View className="items-center mt-4">
              <Text className="text-white text-lg font-psemibold w-96 mt-2">
                1. Place a flexible measuring tape around the base of your neck, just above the collarbone and below the Adam’s apple.
              </Text>
              <Text className="text-white text-lg font-psemibold w-96 mt-2">
                2. Ensure the tape is level and fits snugly around your neck without being tight.
              </Text>
              <Text className="text-white text-lg font-psemibold w-96 mt-2">
                3. Look at the number where the tape meets, and write it down in inches.
              </Text>
            </View>

            <View data-id="WaistImage">
              <Image
                source={images.MeasuringNeck}
                className="w-4/5 h-[33vh] self-center"
                resizeMode="contain"
              />
              {/* Wrap input field in a View with padding to avoid cutoff */}
              <View className="">
                <FormField
                  placeholder="Enter measurement in inches"
                  keyboardType="numeric"
                  handleChangeText={(e) => setNeck(e)}
                />
              </View>
            </View>

            <CustomBTN
              Title={`${form.Gender == "Male" ? "Calculate" : "Next"}`}
              otherStyles="self-center mt-4 w-4/5"
              width={250}
              handlePress={() => {
                if (!neck) return alert("Please enter a neck measurement");
                if (form.Gender == "Female"){
                    navigation.navigate("hipMeasurements", { form, waist, neck });
                }else{
                    calculateBodyFat();
                }
              }}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
};
