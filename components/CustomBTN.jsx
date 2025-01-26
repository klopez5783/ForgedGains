import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomBTN = ({ width , Title , handlePress , containerStyles , textStyles, isLoading }) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className={`bg-darkGold 
        rounded-xl 
        min-h-[50px]
        justify-center 
        items-center 
        mx-auto mt-10 
        ${containerStyles} 
        ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
      style={{ width: width }}
    >
      <Text className={`text-backGround font-psemibold ${textStyles}`}>{Title}</Text>
    </TouchableOpacity>
  )
}

export default CustomBTN