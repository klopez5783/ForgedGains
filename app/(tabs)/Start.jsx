import { View, Text, ScrollView, Modal, Pressable, StyleSheet, TextInput} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { useState } from 'react'
import WheelPicker from '../../components/WheelPicker'
import CustomBTN from '../../components/CustomBTN'

export default function Start() {

  const [weight, setWeight] = useState('');

  const [selectedFeet , setFeet] = useState(0);

  const [selectedInches , setInches] = useState(0);

  const [selectedWeightUnit , setWeightUnit] = useState('Pounds');

  const [heightModalVisible, setHeightModalVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedHeightUnit , setHeightUnit] = useState('IN');

  const [selectedCentimeters , setCentimeters] = useState(175);



  const [form , setForm] = useState({
      FirstName: '',
      LastName: '',
      Gender: '',
      Weight: '',
      Height: '',
      Age: ''
    });

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
                          data={Array.from({length: 350}, (_, i) => i)}
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
                  placeHolder={{"Weight": "Enter Weight"}}
                  onChangeText={weight => setWeight(weight)}
                  defaultValue={weight}
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