import { View, Text, ScrollView, Modal, Pressable, TextInput, Button} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { useState , useCallback } from 'react'
import WheelPicker from '../../components/WheelPicker'
import CustomBTN from '../../components/CustomBTN'
import Select from '../../components/Select'
import {Link} from 'expo-router'
import { router } from 'expo-router'

export default function Start() {

  const [weight, setWeight] = useState('');

  const [selectedFeet , setFeet] = useState(0);

  const [selectedInches , setInches] = useState(0);

  const [selectedWeightUnit , setWeightUnit] = useState('Pounds');

  const [heightModalVisible, setHeightModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedHeightUnit , setHeightUnit] = useState('IN');

  const [selectedCentimeters , setCentimeters] = useState(175);

  const [selectedGender , setSelectedGender] = useState("");

  const [bodyFatModalVisible, setBodyFatModalVisible] = useState(false);

  const [selectedBodyFat , setSelectedBodyFat] = useState("");

  const [bodyFatInput , setBodyFatInput] = useState("");



  const [form , setForm] = useState({
      FirstName: '',
      Gender: '',
      Weight: '',
      Height: '',
      Age: '',
      BodyFat: ''
    });


    const navigateToBodyFat = useCallback(() => {
      router.push("/bodyFat");
    }, []);

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
            otherStyles="mt-7"
            keyboardType="default"
          />

          <View className="flex flex-row justify-evenly w-full mt-7">
            {/* <FormField 
              title="Weight"
              value={form.Weight}
              handleChangeText={(e) => setForm({...form, Weight: e})}
              otherStyles="max-w-[50%] p-1" // Changed w-50 to w-1/2
              keyboardType="numeric"
            /> */}

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

            {/* <FormField
              title={"Height (FT'IN)"}
              value={form.Height}
              handleChangeText={(e) => setForm({...form, Height: e})}
              otherStyles="max-w-[50%] p-1" // Changed w-50 to w-1/2
              keyboardType="numeric"
            /> */}


          <View className="w-1/2 p-1">
            <Text className="font-pmedium text-white text-lg">Height</Text>
            <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setHeightModalVisible(true)}>
                <Text className="text-white font-pmedium self-center text-xl self h-full pt-3">
                {form.Height ? `${form.Height} ${selectedHeightUnit}` : 'Enter Height'}
                </Text>
            </Pressable>
          </View>

          </View>

          <Text className="text-lg text-white font-pmedium mt-7">
            Gender
          </Text>

          <Select optionOne="Male" optionTwo="Female" onSelect={(option) => setSelectedGender(option)} />

          <View className="w-full p-1 mt-7">
            <Text className="font-pmedium text-white text-lg">Body Fat</Text>
            <Pressable
              className="bg-backGround-300 rounded-2xl p-1 h-16 w-full"
              onPress={() => setBodyFatModalVisible(true)}>
                <Text className="text-white font-pmedium self-center text-xl self h-full pt-3">
                {form.BodyFat ? `${form.BodyFat} ${selectedBodyFat}%` : 'Enter Body Fat %'}
                </Text>
            </Pressable>
            <Button
            title="Don't Know Body Fat? Tap Here"
            onPress={ navigateToBodyFat }
            className="text-darkGold font-pmedium text-lg mt-2"
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
                        console.log("Button Pressed");
                        if(selectedHeightUnit === "CM"){
                          setForm({...form, Height: selectedCentimeters});
                          setHeightModalVisible(!heightModalVisible);
                        } else {
                        setForm({...form, Height: selectedFeet + "'" + selectedInches + "''"});
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
          
          {/* <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>Show Modal</Text>
          </Pressable> */}


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}