import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{height: '100%'}}>
        <LinearGradient
        // Background Linear Gradient
        colors={["#000000", "#FFFFFF"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        className='w-full h-full' 
      >
          <View className="w-full justify-start items-center h-full px-4 mt-4">
            <Image source={images.logo}
            className="w-[175px] h-[145px]" />
          </View>
          
      </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}