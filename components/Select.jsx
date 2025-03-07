import { View, Text, Pressable } from 'react-native'
import React from 'react'


export default function Select({ otherStyles , optionOne , optionTwo, onSelect}) {

    const [selectedOption, setSelectedOption] = React.useState("");

    const handleSelection = (option) => {
      const newSelection = selectedOption === option ? "" : option;
      setSelectedOption(newSelection);
      onSelect(newSelection); // Notify parent of the selection change
    };

  return (
    <View className="flex flex-row justify-center w-full mt-1 h-10">
      <Pressable
           onPress={() => handleSelection(optionOne)}
          className={`border border-solid border-darkGold rounded-l-lg p-1 w-1/2 ${selectedOption == optionOne ? "border-lightGold bg-darkGold" : "border-darkGold" }`}
          >
        <Text className={`self-center font-pmedium text-lg ${selectedOption == optionOne ? "text-backGround" : "text-darkGold" }`}>
            {optionOne}
        </Text>
        </Pressable>
        <Pressable
           onPress={() => handleSelection(optionTwo)}
          className={`border border-solid border-darkGold rounded-r-lg p-1 w-1/2 ${selectedOption == optionTwo ? "border-lightGold bg-darkGold" : "border-darkGold" }`}
          >
        <Text className={`self-center font-pmedium text-lg ${selectedOption == optionTwo ? "text-backGround" : "text-darkGold" }`}>
            {optionTwo}
        </Text>
        </Pressable>
    </View>
  )
}

