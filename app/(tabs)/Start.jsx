import { View, Text, ScrollView, Modal, Pressable, TextInput, Button} from 'react-native'
import React, { useState,useEffect,useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import WheelPicker from '../../components/WheelPicker'
import CustomBTN from '../../components/CustomBTN'
import Select from '../../components/Select'
import { router } from 'expo-router'
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';
import {convertToHeightString} from '../../Utilities/heightCalulations'
import { useGlobalContext } from '../../context/globalProvider';
import { updateFitnessData } from '../../Database/FitnessData';

export default function Start() {

  const route = useRoute();
  
  const receivedForm = route.params?.form || {}; // Default to empty object if undefined
  
  const bodyFat = route.params?.bodyFat ?? 0; // Default to 0 if undefined
  
  const navigation = useNavigation();

  const [weight, setWeight] = useState('');

  const [selectedFeet , setFeet] = useState(0);

  const [selectedInches , setInches] = useState(0);

  const [selectedWeightUnit , setWeightUnit] = useState('Pounds');

  const [heightModalVisible, setHeightModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedHeightUnit , setHeightUnit] = useState('IN');

  const [selectedCentimeters , setCentimeters] = useState(175);

  const [bodyFatModalVisible, setBodyFatModalVisible] = useState(false);

  const [bodyFatInput , setBodyFatInput] = useState("");

  const { user, updateUser } = useGlobalContext();

  useEffect(() => {
    // Runs whenever selectedFeet or selectedInches change
    console.log("Feet and Inches changed:", selectedFeet, selectedInches);
    
    if (selectedHeightUnit === "CM") {
      setForm({...form, Height: selectedCentimeters});
    } else {
      setForm({...form, Height: selectedFeet + "'" + selectedInches});
    }
  }, [selectedFeet, selectedInches]); // Runs when selectedFeet or selectedInches change
  

  const [form, setForm] = useState({
    FirstName: '',
    Gender: '',
    Weight: '',
    Height: '',
    Age: '',
    BodyFat: 0
    });

    useEffect(() => {
      if (route.params?.form) {
        setForm(prevForm => ({
          ...prevForm, // Keep existing values if not provided in receivedForm
          ...receivedForm // Override with new values
        }));
      }
    }, [route.params?.form]); // Runs when route.params.form changes

    useEffect(() => {
      if (route.params?.bodyFat) {
        setForm(prevForm => ({
          ...prevForm, // Keep existing values if not provided in receivedForm
          BodyFat: parseFloat(bodyFat).toFixed(2) // Override with new values
        }));
      }
    }, [bodyFat]);


    const navigateToBodyFat = useCallback(() => {
      console.log("Form", form);
      if (!form.Gender) return alert("Please select Gender");
      if (!form.Height) return alert("Please enter Height");
      console.log("Navigating to Body Fat");
      navigation.navigate("waistMeasurement", { form });
    }, [form.Gender]);

    const submitForm = () => {
      console.log("Current Form:\n" , form)
      if (Object.values(form).every(value => value !== '' && value !== null && value !== undefined)) {
        console.log("Form is completely filled out!");
        
        const updatedUser = {
          ...user,
          gender: form.Gender || user.gender, // Use form value if available, else keep existing
          height: Number(form.Height) || user.height,
          weight: Number(form.Weight) || user.weight,
          bodyFat: Number(form.BodyFat) || user.bodyFat,
          firstName: form.FirstName
        };
    
        updateUser(updatedUser);
        updateFitnessData(user, form);

      } else {
        console.log("Please fill out all fields.");
      }
      
    }
      

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
        <View className="w-full justify-center px-4 my-6">
          <Text className="text-3xl text-darkGold font-bold mt-10">
            Start
          </Text>
          <FormField 
            title="First Name"
            value={form.FirstName}
            handleChangeText={(e) => setForm({...form, FirstName: e})}
            otherStyles="text-lg mt-7"
            keyboardType="default"
          />

          <View className="flex flex-row justify-evenly w-full mt-7">

          <View className="w-1/2 p-1">
            <Text className="font-pmedium text-white text-lg">Weight</Text>
            <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setModalVisible(true)}>
              <Text className="text-white font-pmedium self-center text-xl self h-full pt-3">
                {form.Weight ? `${form.Weight} ${selectedWeightUnit}` : 'Enter Weight'}
              </Text>
            </Pressable>
          </View>

          <View className="w-1/2 p-1">
            <Text className="font-pmedium text-white text-lg">Height</Text>
            <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setHeightModalVisible(true)}>
                <Text className="text-white font-pmedium self-center text-xl self h-full pt-3">
                {form.Height != "0'0" ? `${form.Height} ${selectedHeightUnit}` : 'Enter Height'}
                </Text>
            </Pressable>
          </View>

          </View>

          <Text className="text-lg text-white font-pmedium mt-7">
            Gender
          </Text>

          <Select optionOne="Male" defaultOption={form.Gender} optionTwo="Female" onSelect={(option) => { setForm({...form, Gender: option})}} />

          <View className="w-full p-1 mt-7">
            <Text className="font-pmedium text-white text-lg">Body Fat</Text>
            <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setBodyFatModalVisible(true)}>
                <Text className="text-white font-pmedium self-center text-xl self h-full pt-3">
                {form.BodyFat ? `${form.BodyFat}%` : 'Enter Body Fat %'}
                </Text>
            </Pressable>
            <Button
            title="Don't Know Body Fat? Tap Here"
            onPress={ navigateToBodyFat }
            className="text-darkGold font-pmedium text-lg mt-2"
            />
          </View>


          <View>
            <FormField 
              title="Age"
              value={form.Age}
              handleChangeText={(e) => setForm({...form, Age: e})}
              otherStyles="text-lg"
              keyboardType="numeric"
            />
          <CustomBTN
              Title="Submit"
              otherStyles="bg-darkGold mt-5 mx-2"
              handlePress={() => submitForm()}
              width={100}
            />
          </View>
          

          <Modal
          animationType='slide'
          transparent={true}
          visible={bodyFatModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!bodyFatModalVisible);
          }}>
            <View className="justify-center items-center flex-1 bg-backGround/50">
            <View className="bg-backGround-300 h-1/4 w-2/3 rounded-2xl p-4 justify-center items-center" data-id="BodyFatModalView">
              <Text className="text-2xl font-psemibold text-white">Body Fat</Text>

              <View className="w-2/3 rounded-lg border border-darkGold mt-5 p-2 flex-row items-center">
                <TextInput
                  placeholder="Body Fat"
                  onChangeText={bodyFat => setBodyFatInput(bodyFat)}
                  defaultValue={form.BodyFat}
                  style={{ color: 'white', textAlign: 'center' }}
                  keyboardType="numeric"
                  className="flex-1 text-white"
                />
                <Text className="text-white">%</Text>
              </View>


              <View className="flex flex-row justify-evenly mt-5">
                <CustomBTN
                    Title="Cancel"
                    otherStyles="bg-darkGold mt-5 mx-2"
                    handlePress={() => setBodyFatModalVisible(!bodyFatModalVisible)}
                    width={100}
                  />
                    <CustomBTN
                    Title="Set Body Fat"
                    otherStyles="bg-darkGold mt-5 mx-2"
                    handlePress={() => {
                      setForm({...form, BodyFat: bodyFatInput});
                      setBodyFatModalVisible(!bodyFatModalVisible);
                    }}
                  width={100}
                  />
              </View>

              

              </View>

            </View>
          </Modal>


          <Modal
          animationType='slide'
          transparent={true}
          visible={heightModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!heightModalVisible);
          }}>
              <View className="justify-center items-center flex-1 bg-backGround/50">
                <View className="bg-backGround-300 h-1/3 w-3/4 rounded-2xl p-4" data-id="modalView">
                  <Text className="text-2xl font-psemibold self-center text-white">Height</Text>
                  

                    <View className="flex flex-row justify-evenly h-2/3">

                        {selectedHeightUnit === "IN" ? (
                          <>
                          <WheelPicker
                          data={[1,2,3,4,5,6,7,8]}
                          selectedOption={selectedFeet}
                          setOptionFN={setFeet}
                          />
  
                          <WheelPicker
                          data={[1,2,3,4,5,6,7,8,9,10,11]}
                          selectedOption={selectedInches}
                          setOptionFN={setInches}
                          />
                          </>
                        ) : (
                          <WheelPicker
                          data={Array.from({length: 350}, (_, i) => i + 140)}
                          selectedOption={selectedCentimeters}
                          setOptionFN={setCentimeters}
                          />
                        )}

                        <WheelPicker
                        data={["IN", "CM"]}
                        selectedOption={selectedHeightUnit}
                        setOptionFN={setHeightUnit}
                        />

                  </View>

                  {/* Bottom of the modal */}

                  <View className="flex flex-row justify-evenly">
                    <CustomBTN
                      Title="Cancel"
                      otherStyles="bg-darkGold self-center mt-2"
                      handlePress={() => {
                        setHeightModalVisible(!heightModalVisible);
                      }}
                      width={125}
                    />

                    <CustomBTN
                      Title="Set Height"
                      otherStyles="bg-darkGold self-center mt-2"
                      handlePress={() => {
                        if(selectedHeightUnit === "CM"){
                          setForm({...form, Height: selectedCentimeters});
                          setHeightModalVisible(!heightModalVisible);
                        } else {
                        setForm({...form, Height: selectedFeet + "'" + selectedInches});
                        setHeightModalVisible(!heightModalVisible);
                      }
                    }}
                    width={125}
                    />

                  </View>


                </View>
              </View>

          </Modal>


          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View className="justify-center items-center flex-1 bg-backGround/50">
                <View className="bg-backGround-300 h-1/3 w-3/4 rounded-2xl p-4" data-id="modalView">
                  <Text className="text-2xl font-psemibold self-center text-white">Weight</Text>
                  
                  <WheelPicker
                  data={["Pounds","Stone","Kilograms"]}
                  selectedOption={selectedWeightUnit}
                  setOptionFN={setWeightUnit}
                  />

                  <TextInput
                  placeholder="Enter Weight"
                  onChangeText={weight => setWeight(weight)}
                  defaultValue={form.weight}
                  className="w-2/3  rounded-lg border border-darkGold m-2 p-2 self-center"
                  style={{ color: 'white', textAlign: 'center' }}
                  keyboardType="numeric"
                  />

                  <View className="flex flex-row justify-evenly">
                    <CustomBTN
                      Title="Cancel"
                      otherStyles="bg-darkGold self-center mt-2"
                      handlePress={() => {
                        setModalVisible(!modalVisible);
                      }}
                      width={125}
                    />

                    <CustomBTN
                      Title="Set Weight"
                      otherStyles="bg-darkGold self-center mt-2"
                      handlePress={() => {
                        setForm({...form, Weight: weight});
                        setModalVisible(!modalVisible);
                      }}
                      width={125}
                    />

                  </View>


                </View>
              </View>
          </Modal>


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}