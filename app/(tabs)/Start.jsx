import { View, Text, ScrollView, Modal, Pressable, StyleSheet, TextInput} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { useState } from 'react'
import WheelPicker from '../../components/WheelPicker'

export default function Start() {

  const [text, setText] = useState('');

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: 300, // Add this line to set the height of the modal
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });
  

  const [modalVisible, setModalVisible] = useState(false);


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
          <FormField 
            title="Last Name"
            value={form.LastName}
            handleChangeText={(e) => setForm({...form, LastName: e})}
            otherStyles="mt-7"
            keyboardType="default"
          />
          <View className="flex flex-row justify-evenly">
            <FormField 
              title="Weight (LBS)"
              value={form.Weight}
              handleChangeText={(e) => setForm({...form, Weight: e})}
              otherStyles="mt-7 w-1/2 p-1"
              keyboardType="numeric"
            />
            <FormField
              title={"Height (FT'IN)"}
              value={form.Height}
              handleChangeText={(e) => setForm({...form, Height: e})}
              otherStyles="mt-7 w-1/2 p-1"
              keyboardType="numeric"
            />
          </View>


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
                  data={["Pounds","Stone","Kilograms"]} />

                  <TextInput
                  placeHolder={{"Weight": "Enter Weight"}}
                  onChangeText={newText => setText(newText)}
                  defaultValue={text}
                  className="w-2/3  rounded-lg border border-darkGold m-2 p-2 self-center mb-4"
                  style={{ color: 'white', textAlign: 'center' }}
                  keyboardType="numeric"
                  />

                  <Pressable
                    className="justify-center self-center bg-darkGold rounded-2xl p-3"
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text className="text-lg font-psemibold text-white">Hide Modal</Text>
                  </Pressable>
                </View>
              </View>
          </Modal>
          
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>Show Modal</Text>
          </Pressable>


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}