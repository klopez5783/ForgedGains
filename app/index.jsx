import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';

export default function App() {
  return (
    <SafeAreaView className='bg-backGround h-full'>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-start items-center h-full px-4 mt-4">
           <Image source={images.logo}
           className="w-[175px] h-[145px]" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
