import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from "@react-navigation/native"
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserData, updateFitnessData } from '../../Database/FitnessData'
import { calculateGuestData } from '../../Utilities/FitnessDataCalculations'
import CustomBTN from '../../components/CustomBTN'
import FormField from '../../components/FormField'
import Select from '../../components/Select'
import WheelPicker from '../../components/WheelPicker'
import PillList from '../../components/pillList'
import { useGlobalContext } from '../../context/globalProvider'

export default function Calculator() {

  const route = useRoute();

  const router = useRouter();
  
  const receivedForm = route.params?.form || {}; // Default to empty object if undefined
  
  const bodyFat = route.params?.bodyFat ?? 0; // Default to 0 if undefined
  
  const navigation = useNavigation();

  const [weight, setWeight] = useState('');

  const [selectedFeet , setFeet] = useState(0);

  const [selectedInches , setInches] = useState(0);

  const [selectedWeightUnit , setWeightUnit] = useState('Pounds');

  const [heightModalVisible, setHeightModalVisible] = useState(false);

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedHeightUnit , setHeightUnit] = useState('IN');

  const [selectedCentimeters , setCentimeters] = useState(175);

  const [bodyFatModalVisible, setBodyFatModalVisible] = useState(false);

  const [bodyFatInput , setBodyFatInput] = useState("");

  const { user, updateUser } = useGlobalContext();

  const [selectedActivityLevel, setActivityLevel] = useState()

  const [activityLevelModalVisible, setActivityLevelModalVisible] = useState(false);

  useEffect(() => {
    console.log("Use Effect Triggered")
    if (user) {
      setForm((prevForm) => ({
        ...prevForm, // Preserve existing form data
        Age: user?.age || prevForm.Age || "",
        Gender: user?.gender || prevForm.Gender || "",
        Weight: user?.weight || prevForm.Weight || "",
        height: user?.height || prevForm.height || "",
      }));
    }else{
      console.log("User is not defined")
    }
  }, [user]);

  useEffect(() => {
    console.log("Form State Updated:", form);
  }, [form]);
  
  

// --- REPLACE EXISTING useEffect FOR selectedFeet/Inches ---
useEffect(() => {
    console.log("Feet and Inches changed:", selectedFeet, selectedInches);
    
    if (selectedHeightUnit === "CM") {
        setForm((prevForm) => ({ ...prevForm, height: selectedCentimeters }));
    } else {
        // Ensure the string format is correct
        const heightStr = selectedFeet + "'" + selectedInches;
        setForm((prevForm) => ({ ...prevForm, height: heightStr }));
    }
}, [selectedFeet, selectedInches, selectedCentimeters, selectedHeightUnit]); 
// 👆 The dependency array now correctly includes all height state variables.
// -----------------------------------------------------------------
  

  const [form, setForm] = useState({
    Gender: '',
    Weight: '',
    height: '',
    Age: '',
    BodyFat: 0,
    ActivityLevel: ''
    });

    const [showSubmissionModal, setShowSubmissionModal] = useState(false);

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

    const handleNavigateToBodyFat = () => {
      console.log("Form", form);
      if (!form.Gender) return alert("Please select Gender");
      if (form.height == "0'0") return alert("Please enter Height");
      console.log("Navigating to Body Fat");
      navigation.navigate("waistMeasurement", { form });
    }


const handleSubmitPress = () => {
    // Field validation
    if (!Object.values(form).every(value => value !== '' && value !== null && value !== undefined)) {
      alert("Please fill out all fields before submitting.");
      return;
    }
    
    // Show medical disclaimer modal
    setShowSubmissionModal(true);
  };

  const proceedWithSubmission = async () => {
    // Close modal
    setShowSubmissionModal(false);
    
    // Your existing submitForm logic goes here
    console.log("Current Form:\n", form);
    
    const isAuthenticatedUser = user && user.uid;
    let success = false;

    if (isAuthenticatedUser) {
      try {
        await updateFitnessData(user, form);
        const refreshedUser = await getUserData(user);
        updateUser(refreshedUser);
        success = true;
      } catch (error) {
        console.error("Error saving data for authenticated user:", error);
        alert("Failed to save your fitness data. Please try again.");
      }
    } else {
      console.log("Guest user detected. Calculating and updating session state.");
      const guestResults = calculateGuestData(form);

      if (guestResults) {
        updateUser({
          ...user,
          ...guestResults
        });
        alert("Your calculations are complete! Please sign up or log in to save this data permanently.");
        success = true;
      } else {
        alert("Calculation failed due to invalid inputs.");
      }
    }

    if (success) {
      setTimeout(() => {
        router.replace('/Home'); 
      }, 10);
    }
  };
      

  return (
    <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
    <SafeAreaView className="bg-backGround h-9/10">
      <ScrollView>

        <View className={`mx-auto justify-center px-4`}>
    
           <Text className="text-3xl text-darkGold font-bold mt-2">
       Deficit Calculator
         </Text>


      {/* ✅ ADD: Info banner for guests */}
      {user?.isAnonymous && (
        <View className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 mt-3">
          <Text className="text-white text-sm text-center">
            ℹ️ Your results will be shown after you complete this form. 
            Sign up to save your data permanently.
          </Text>
        </View>
      )}

     {/* Weight & Height */}
         <View className="flex flex-row mx-auto w-full justify-evenly mt-5">
            <View className="w-1/2 p-1">
              <Text className="font-pmedium text-white text-lg">Weight</Text>
              <Pressable
                className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
                onPress={() => setModalVisible(true)}>
                <Text className={`text-white ${form.Weight ? "font-pmedium" : "font-pextralight"} self-center text-xl h-full pt-3`}>
                  {form.Weight ? `${form.Weight} ${selectedWeightUnit}` : "Enter Weight"}
                </Text>
              </Pressable>
            </View>
            <View className="w-1/2 p-1">
              <Text className="font-pmedium text-white text-lg">Height</Text>
              <Pressable
                className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
                onPress={() => setHeightModalVisible(true)}
              >
                <Text className={`text-white ${form.height != "0'0" ? "font-pmedium" : "font-pextralight"} self-center text-xl h-full pt-3`}>
                  {form.height != "0'0" ? `${form.height} ${selectedHeightUnit}` : "Enter Height"}
                </Text>
              </Pressable>
            </View> 
        </View>

        {/* Gender */}
        <View className="w-full p-1">
          <Text className="text-lg text-white font-pmedium mt-5">Gender</Text>
        <Select
          optionOne="Male"
          defaultOption={form.Gender}
          optionTwo="Female"
          onSelect={option => setForm({ ...form, Gender: option })}
        />
        </View>

        {/* Activity Level */}
        <View className=" p-1 mt-5">
          <Text className="font-pmedium text-white text-lg">Activity Level</Text>
          <Pressable
            className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
            onPress={() => {
              setActivityLevelModalVisible(true);
              console.log("Button Pressed");
            }}
          >
            <Text className={`text-white ${form.ActivityLevel ? "font-pmedium" : "font-pextralight"} self-center text-xl h-full pt-3`}>
              {form.ActivityLevel ? `${form.ActivityLevel}` : "Enter Activity Level"}
            </Text>
          </Pressable>
        </View>

        {/* Body Fat */}
        <View className="p-1 mt-5">
          <View className="flex-row items-center">
            <Text className="font-pmedium text-white text-lg">Body Fat </Text>
            <Pressable onPress={() => setInfoModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={20} color="white" />
            </Pressable>
          </View>
          <Pressable
            className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
            onPress={() => setBodyFatModalVisible(true)}
          >
            <Text className={`text-white ${form.BodyFat ? "font-pmedium" : "font-pextralight"} self-center text-xl h-full pt-3`}>
              {form.BodyFat ? `${form.BodyFat}%` : "Enter Body Fat %"}
            </Text>
          </Pressable>
          <Button
            title="Don't Know Body Fat? Tap Here"
            onPress={handleNavigateToBodyFat}
            className="text-darkGold font-pmedium text-lg mt-2"
          />
        </View>

        {/* Age */}
        <FormField
          title="Age"
          value={form.Age}
          handleChangeText={e => setForm({ ...form, Age: e })}
          keyboardType="numeric"
        />

        {/* Submit */}
        <CustomBTN
          Title="Submit Form"
          otherStyles="bg-darkGold mt-4 mx-2"
          handlePress={handleSubmitPress}  // ✅ NEW
          width={125}
        />

        {/* Body Fat Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={bodyFatModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!bodyFatModalVisible);
          }}
        >
          <View className="justify-center items-center flex-1 bg-backGround/50">
            <View className="bg-backGround-300 h-1/4 w-2/3 rounded-2xl p-4 justify-center items-center" data-id="BodyFatModalView">
              <Text className="text-2xl font-psemibold text-white">Body Fat</Text>
              <View className="w-2/3 rounded-lg border border-darkGold mt-5 p-2 flex-row items-center">
                <TextInput
                  placeholder="Body Fat"
                  onChangeText={bodyFat => setBodyFatInput(bodyFat)}
                  defaultValue={form.BodyFat}
                  style={{ color: "white", textAlign: "center" }}
                  keyboardType="numeric"
                  className="flex-1 text-white"
                />
                <Text className="text-white">%</Text>
              </View>
              <View className="flex flex-row justify-evenly mt-3">
                <CustomBTN
                  Title="Cancel"
                  otherStyles="bg-darkGold mt-5 mr-2"
                  handlePress={() => setBodyFatModalVisible(!bodyFatModalVisible)}
                  width={100}
                />
                <CustomBTN
                  Title="Set Body Fat"
                  otherStyles="bg-darkGold mt-5 ml-2"
                  handlePress={() => {
                    setForm({ ...form, BodyFat: bodyFatInput });
                    setBodyFatModalVisible(!bodyFatModalVisible);
                  }}
                  width={100}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Height Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={heightModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!heightModalVisible);
          }}
        >
          <View className="justify-center items-center flex-1 bg-backGround/50">
            <View className="bg-backGround-300 h-1/3 w-3/4 rounded-2xl p-4" data-id="modalView">
              <Text className="underline underline-offset-4 mb-2 text-2xl font-psemibold self-center text-white">Height</Text>
              <View className="flex flex-row justify-evenly h-2/3">
                {selectedHeightUnit === "IN" ? (
                  <>
                    <WheelPicker
                      data={[1, 2, 3, 4, 5, 6, 7, 8]}
                      selectedOption={selectedFeet}
                      setOptionFN={setFeet}
                      Title={"Feet"}
                    />
                    <WheelPicker
                      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                      selectedOption={selectedInches}
                      setOptionFN={setInches}
                      Title={"Inches"}
                    />
                  </>
                ) : (
                  <WheelPicker
                    data={Array.from({ length: 350 }, (_, i) => i + 140)}
                    selectedOption={selectedCentimeters}
                    setOptionFN={setCentimeters}
                    Title={"Centimeters"}
                  />
                )}
                <WheelPicker
                  data={["IN", "CM"]}
                  selectedOption={selectedHeightUnit}
                  setOptionFN={setHeightUnit}
                />
              </View>
              <View className="flex flex-row justify-evenly">
                <CustomBTN
                  Title="Cancel"
                  otherStyles="bg-darkGold self-center mt-2"
                  handlePress={() => setHeightModalVisible(!heightModalVisible)}
                  width={125}
                />
                <CustomBTN
                    Title="Set Height"
                    otherStyles="bg-darkGold self-center mt-2"
                    handlePress={() => {
                        // 🛑 REMOVED: Redundant setForm logic. 
                        // The updated useEffect (in section 2) now handles setting the form state 
                        // whenever the height picker states change. We only need to close the modal here.
                        setHeightModalVisible(!heightModalVisible); 
                    }}
                    width={125}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Info Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={infoModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!infoModalVisible);
          }}
        >
          <View className="justify-center items-center flex-1 bg-backGround/50">
            <View className="bg-backGround-300 h-1/3 w-3/4 rounded-2xl p-4" data-id="modalView">
              <View className="flex flex-row justify-end">
                <Pressable onPress={() => setInfoModalVisible(!infoModalVisible)}>
                  <MaterialCommunityIcons name="close-circle" size={24} color="white" />
                </Pressable>
              </View>
              <View className="flex flex-row justify-center items-center mt-3">
                <Text className="text-white text-lg font-psemibold self-center">
                  "Actual body fat percentage may vary based on muscle mass, hydration, and distribution of fat in different areas.
                  This is an estimate based on the U.S. Navy Body Fat formula."
                </Text>
              </View>
              <CustomBTN
                Title="Okay"
                otherStyles="bg-darkGold self-center mt-2"
                handlePress={() => setInfoModalVisible(!infoModalVisible)}
                width={125}
              />
            </View>
          </View>
        </Modal>

        {/* Weight Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View className="justify-center items-center flex-1 bg-backGround/50">
            <View className="bg-backGround-300 h-1/3 w-3/4 rounded-2xl p-4" data-id="modalView">
              <Text className="underline underline-offset-4 mb-2 text-2xl font-psemibold self-center text-white">Weight</Text>
              <PillList
                data={["Pounds", "Stone", "Kilograms"]}
                selectedOption={selectedWeightUnit}
                setOptionFN={setWeightUnit}
              />
              <TextInput
                placeholder="Enter Weight"
                onChangeText={weight => setWeight(weight)}
                defaultValue={form.weight}
                className="w-2/3 rounded-lg border border-darkGold m-2 p-2 self-center"
                style={{ color: "white", textAlign: "center" }}
                keyboardType="numeric"
              />
              <View className="flex flex-row justify-evenly">
                <CustomBTN
                  Title="Cancel"
                  otherStyles="bg-darkGold self-center mt-2"
                  handlePress={() => setModalVisible(!modalVisible)}
                  width={125}
                />
                <CustomBTN
                  Title="Set Weight"
                  otherStyles="bg-darkGold self-center mt-2"
                  handlePress={() => {
                    setForm({ ...form, Weight: weight });
                    setModalVisible(!modalVisible);
                  }}
                  width={125}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Activity Level Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={activityLevelModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!activityLevelModalVisible);
          }}
        >
          <View className="justify-center items-center flex-1 bg-backGround/50">
            <View className="bg-backGround-300 h-2/3 w-4/5 rounded-2xl p-4" data-id="modalView">
              <Text className="underline underline-offset-4 mb-2 text-2xl font-psemibold self-center text-white">Activity Level</Text>
              <WheelPicker
                data={["Sedentary", "Slightly Active", "Moderately Active", "Very Active"]}
                descriptions={[
                  "Little or no physical activity, typically a desk job or minimal movement throughout the day.Example: Office work, watching TV, and minimal walking.",
                  "A job that involves some physical activity or light intensity exercise 1-3 days per week. Example: Light walking, casual biking, or household chores.",
                  "Moderately Active Jobs that keep you on your feet most of the day, or moderate intensity exercise 3-5 days per week. Example: Gym sessions, running, or active jobs like retail.",
                  "A physical job, very hard exercise, or physical training. Example: Pro athletes, military training, or jobs with continuous high physical activity.",
                ]}
                selectedOption={selectedActivityLevel}
                setOptionFN={setActivityLevel}
              />
              <CustomBTN
                Title="Set Activity Level"
                otherStyles="bg-darkGold self-center mt-2"
                handlePress={() => {
                  setForm({ ...form, ActivityLevel: selectedActivityLevel });
                  console.log("Form " + form);
                  setActivityLevelModalVisible(!activityLevelModalVisible);
                }}
                width={125}
              />
            </View>
          </View>
        </Modal>

        <Modal
        animationType="slide"
        transparent={true}
        visible={showSubmissionModal}
        onRequestClose={() => setShowSubmissionModal(false)}
      >
        <View className="justify-center items-center flex-1 bg-backGround/90">
          <View className="bg-backGround-300 w-11/12 max-w-md rounded-2xl p-5" style={{ maxHeight: '75%' }}>
            
            <View className="items-center mb-4">
              <Text className="text-3xl mb-2">⚕️</Text>
              <Text className="text-darkGold text-2xl font-pbold text-center">
                Before You Continue
              </Text>
            </View>

            <ScrollView className="mb-4" showsVerticalScrollIndicator={true}>
              {/* Main Disclaimer */}
              <View className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 mb-4">
                <Text className="text-yellow-200 font-psemibold text-base mb-3">
                  Important Medical Notice:
                </Text>
                <Text className="text-yellow-100 text-sm leading-5 mb-3">
                  The calculations provided are educational estimates based on scientific formulas. 
                  They are NOT medical measurements and cannot replace professional assessment.
                </Text>
                <Text className="text-yellow-100 text-sm leading-5">
                  Please consult with a doctor or registered dietitian before starting any new 
                  diet or exercise program, especially if you have existing health conditions.
                </Text>
              </View>

              {/* What This App Does NOT Do */}
              <View className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
                <Text className="text-red-300 font-psemibold text-sm mb-2">
                  This App Does NOT:
                </Text>
                <Text className="text-red-200 text-xs leading-4">
                  ❌ Measure biological data with sensors{'\n'}
                  ❌ Provide medical-grade accuracy{'\n'}
                  ❌ Diagnose medical conditions{'\n'}
                  ❌ Replace professional medical advice
                </Text>
              </View>

              {/* Individual Variation */}
              <View className="bg-gray-800 rounded-lg p-4">
                <Text className="text-gray-300 font-psemibold text-sm mb-2">
                  Individual Results May Vary Due To:
                </Text>
                <Text className="text-gray-400 text-xs leading-4">
                  • Metabolic differences{'\n'}
                  • Body composition variations{'\n'}
                  • Measurement accuracy{'\n'}
                  • Hormonal factors{'\n'}
                  • Medical conditions
                </Text>
              </View>
            </ScrollView>

            {/* Buttons */}
            <View className="flex-row justify-between mt-2">
              <CustomBTN
                Title="Cancel"
                otherStyles="bg-gray-600"
                handlePress={() => setShowSubmissionModal(false)}
                width={140}
              />
              <CustomBTN
                Title="I Understand"
                otherStyles="bg-darkGold"
                handlePress={proceedWithSubmission}
                width={140}
              />
            </View>

            <Text className="text-gray-500 text-xs text-center mt-3 leading-4">
              By continuing, you acknowledge this is for educational purposes only 
              and not a substitute for medical advice.
            </Text>
          </View>
        </View>
      </Modal>

        </View>
      </ScrollView>
    </SafeAreaView>
  </KeyboardAvoidingView>
)
}
