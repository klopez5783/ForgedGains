import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from "@react-navigation/native"
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { updateFitnessData } from '../../Database/FitnessData'
import CustomBTN from '../../components/CustomBTN'
import FormField from '../../components/FormField'
import Select from '../../components/Select'
import WheelPicker from '../../components/WheelPicker'
import PillList from '../../components/pillList'
import { useGlobalContext } from '../../context/globalProvider'

export default function Calculator() {

  const route = useRoute();
  
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
        Height: user?.height || prevForm.Height || "",
      }));
    }else{
      console.log("User is not defined")
    }
  }, [user]);

  useEffect(() => {
    console.log("Form State Updated:", form);
  }, [form]);
  
  

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
    Gender: '',
    Weight: '',
    Height: '',
    Age: '',
    BodyFat: 0,
    ActivityLevel: ''
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

    const handleNavigateToBodyFat = () => {
      console.log("Form", form);
      if (!form.Gender) return alert("Please select Gender");
      if (form.Height == "0'0") return alert("Please enter Height");
      console.log("Navigating to Body Fat");
      navigation.navigate("waistMeasurement", { form });
    }


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

        router.push('/Home');


      } else {
        alert("Please fill out all fields before submitting.");
      }
      
    }
      

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView>
        {/* <View className={`mx-auto justify-center px-4 my-6`}>

        <Text className="text-3xl text-darkGold font-bold mt-10">
          Deficit Calculator
        </Text>

         {/* Weight & Height */}
        {/* <View className="flex flex-row mx-auto w-3/5 justify-evenly mt-7">
         <View className="flex flex-row mx-auto w-3/5 justify-evenly mt-7">
            <View className="w-1/2 p-1">
             <Text className="font-pmedium text-white text-lg">Weight</Text>
             <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setModalVisible(true)}
            >
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
              <Text className={`text-white ${form.Height != "0'0" ? "font-pmedium" : "font-pextralight"} self-center text-xl h-full pt-3`}>
                {form.Height != "0'0" ? `${form.Height} ${selectedHeightUnit}` : "Enter Height"}
              </Text>
            </Pressable>
          </View> 
        </View>

        {/* Gender */}
        {/* <View className="w-3/5 p-1">
          <Text className="text-lg text-white font-pmedium mt-7">Gender</Text>
        <Select
          optionOne="Male"
          defaultOption={form.Gender}
          optionTwo="Female"
          onSelect={option => setForm({ ...form, Gender: option })}
        />
        </View>
          
        <FormField
        title="Age"
        value={form.Age}
        handleChangeText={e => setForm({ ...form, Age: e })}
        keyboardType="numeric"
        />
          

        </View> */}

        <View className={`mx-auto justify-center px-4 my-6`}>
    
           <Text className="text-3xl text-darkGold font-bold mt-10">
       Deficit Calculator
         </Text>
     {/* Weight & Height */}
         <View className="flex flex-row mx-auto w-3/5 justify-evenly mt-7">
            <View className="w-1/2 p-1">
             <Text className="font-pmedium text-white text-lg">Weight</Text>
             <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setModalVisible(true)}
            >
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
              <Text className={`text-white ${form.Height != "0'0" ? "font-pmedium" : "font-pextralight"} self-center text-xl h-full pt-3`}>
                {form.Height != "0'0" ? `${form.Height} ${selectedHeightUnit}` : "Enter Height"}
              </Text>
            </Pressable>
          </View> 
        </View>

        {/* Gender */}
        <View className="w-3/5 p-1">
          <Text className="text-lg text-white font-pmedium mt-7">Gender</Text>
        <Select
          optionOne="Male"
          defaultOption={form.Gender}
          optionTwo="Female"
          onSelect={option => setForm({ ...form, Gender: option })}
        />
        </View>

        {/* Activity Level */}
        <View className=" p-1 mt-7">
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
        <View className="p-1 mt-7">
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
          handlePress={() => submitForm()}
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
                    if (selectedHeightUnit === "CM") {
                      setForm({ ...form, Height: selectedCentimeters });
                      setHeightModalVisible(!heightModalVisible);
                    } else {
                      setForm({ ...form, Height: selectedFeet + "'" + selectedInches });
                      setHeightModalVisible(!heightModalVisible);
                    }
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

        </View>
      </ScrollView>
    </SafeAreaView>
)
}
