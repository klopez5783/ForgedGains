import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

export default function bodyFat() {

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView className="bg-backGround h-full">

      <Button
       title="Back"
        onPress={() => router.back()}
        className="text-darkGold font-pmedium text-lg mt-2"
      />

      <View className="w-full">
        <Text className="text-darkGold-100 self-center text-xl font-psemibold">Grab a measuring tape <MaterialCommunityIcons name="tape-measure" size={35} color="white" className="self-center" /> </Text>
      </View>

    </SafeAreaView>
  )
}

