import { Platform, Text, TouchableOpacity } from 'react-native'

const CustomBTN = ({ width , Title , handlePress , containerStyles , textStyles, isLoading, otherStyles }) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className={`bg-darkGold 
        rounded-xl 
        min-h-[50px]
        justify-center 
        items-center 
        mx-auto 
        ${containerStyles} 
        ${isLoading ? 'opacity-50' : ''}
        ${otherStyles}`}
        disabled={isLoading}
      style={{ width: width }}
    >
      {Platform.isPad ? (
        <Text className={`text-backGround text-xl font-pbold ${textStyles}`}>{Title}</Text>
      ) : (
        <Text className={`text-backGround font-psemibold ${textStyles}`}>{Title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default CustomBTN