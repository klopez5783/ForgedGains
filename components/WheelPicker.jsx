import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useState } from 'react'

export default function WheelPicker({data = ["insert" , "Data" , "Here"] , otherStyles}){ // Add default value for data

   // Create an array with the same length and items as data
    const items = Array.from({ length: data.length }, (_, i) => data[i]) ;


    return (
        <ScrollView contentContainerStyle={styles.container}>
          {items.map((item, index) => (
            <View key={index} className="p-2 w-5/6 mx-auto bg-backGround-100 rounded-xl m-1">
              <Text className="text-center text-white font-xl font-bold">{item}</Text>
            </View>
          ))}
        </ScrollView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        paddingVertical: 10,
        alignItems: 'center',
      },
      item: {
        width: '90%',
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#007bff',
        borderRadius: 10,
        alignItems: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
});
