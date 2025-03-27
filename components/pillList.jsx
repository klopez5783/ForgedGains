import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'

export default function PillList({descriptions , data = ["insert" , "Data" , "Here"], selectedOption , setOptionFN}) {
  return (
    <View>
      {data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => setOptionFN(item) }>
            <View
            className={`p-2 w-4/6 mx-auto rounded-xl m-1 ${
                selectedOption === item ? "bg-blue-500" : "bg-backGround-100"
            }`}
            >
            <Text className="text-center text-white font-xl font-bold">{item}</Text>
            {descriptions && descriptions.length > 0 && (
                <Text className="text-center text-white font-md font-plight">{descriptions[index]}</Text>
            )}
            </View>
        </TouchableOpacity>
        ))}
    </View>
  )
}
