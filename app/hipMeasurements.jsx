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

export default function hipMeasurements() {
    const route = useRoute(); 
    const navigation = useNavigation();

    const { form, waist, neck } = route.params;

    const [hip, setHip] = useState("");

    const calculateBodyFat = () => {
        const waistNum = parseFloat(waist);
        const neckNum = parseFloat(neck);
        const hipNum = parseFloat(hip);
        const heightNum = convertToInches(form.Height) == "Invalid height Format" ? null : convertToInches(form.Height);

          // Log the values to check if they're valid numbers
        console.log("waist:", waistNum);
        console.log("neck:", neckNum);
        console.log("hip:", hipNum);
        console.log("height:", heightNum);

        const bodyFat = 163.205 * Math.log10(waistNum + hipNum - neckNum) 
              - 97.684 * Math.log10(heightNum) 
              - 78.387;  // Corrected subtraction
        console.log("Calulated Body Fat:", bodyFat);
        navigation.navigate("(tabs)", { screen: "Start", params: { form, bodyFat } });
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
                  Measuring your Hip
                </Text>
                <View className="items-center mt-4">
                  <Text className="text-white text-lg font-psemibold w-96 mt-2">
                    1. Stand Upright: Have the person stand with their feet together and their weight evenly distributed.
                  </Text>
                  <Text className="text-white text-lg font-psemibold w-96 mt-2">
                    2. Wrap the Tape: Position the tape around the fullest part of the hips and buttocks, ensuring it's parallel to the floor.
                  </Text>
                  <Text className="text-white text-lg font-psemibold w-96 mt-2">
                    3. Check the Measurement: Ensure the tape is snug but not tight, and take the measurement at the point where the tape meets the starting point.
                  </Text>
                </View>
    
                <View data-id="WaistImage">
                  <Image
                    source={images.MeasuringHip}
                    className="w-4/5 h-[33vh] self-center"
                    resizeMode="contain"
                  />
                  {/* Wrap input field in a View with padding to avoid cutoff */}
                  <View className="">
                    <FormField
                      placeholder="Enter measurement in inches"
                      keyboardType="numeric"
                      handleChangeText={(e) => setHip(e)}
                    />
                  </View>
                </View>
    
                <CustomBTN
                  Title="Calculate"
                  otherStyles="self-center mt-4 w-4/5"
                  width={250}
                  handlePress={() => {
                    if (!hip) return alert("Please enter a hip measurement");
                    calculateBodyFat();
                  }}
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
      );
    };
    