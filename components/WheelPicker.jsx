import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'

export default function WheelPicker({data = ["insert" , "Data" , "Here"] , selectedOption , setOptionFN}){ // Add default value for data

   // Create an array with the same length and items as data
    return (
      <ScrollView className="self-center w-full">
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => setOptionFN(item) }>
            <View
              className={`p-2 w-5/6 mx-auto rounded-xl m-1 ${
                selectedOption === item ? "bg-blue-500" : "bg-backGround-100"
              }`}
            >
              <Text className="text-center text-white font-xl font-bold">{item}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
    }
 
