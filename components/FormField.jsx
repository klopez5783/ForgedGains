import { useState } from 'react';
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { icons } from '../constants';


export default function FormField({title , value , placeholder , handleChangeText , otherStyles, ...props}) {

  const [ showPassword , setShowPassword ] = useState(false);

  return (
    <View className={`w-full ${otherStyles}`}>
      {Platform.isPad ? <Text className="text-gray-100 text-2xl font-pmedium">{title}</Text> : <Text className="text-base text-gray-100 font-pmedium">{title}</Text>}
      {Platform.isPad ? 
      <View className="
      mx-auto
      w-3/5 h-16 px-4 
      bg-backGround-300
      rounded-2xl
      focus:border-#0A52FF items-center flex-row ">
        <TextInput
          className="mx auto flex-1 text-white font-semibold text-base h-full"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8D8D8D"
          onChangeText={handleChangeText}
          secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword }
          {...props}
        />

        {(title === 'Password' || title === 'Confirm Password') && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image 
                source={!showPassword ? icons.eye : icons.eyeHide}
                className="w-6 h-6"
                resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View> : (<View className="
      w-full h-16 px-4 
      bg-backGround-300
      rounded-2xl
      focus:border-#0A52FF items-center flex-row ">
        <TextInput
          className="flex-1 text-white font-semibold text-base h-full"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8D8D8D"
          onChangeText={handleChangeText}
          secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword }
          {...props}
        />

        {(title === 'Password' || title === 'Confirm Password') && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image 
                source={!showPassword ? icons.eye : icons.eyeHide}
                className="w-6 h-6"
                resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>)}
    </View>
  )
}