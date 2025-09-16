import { useNavigation } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { icons, images } from '../../constants';

function TabIcon({ icon, color, name, focused,size }) {
    return (
        <View className="items-center justify-center mt-4">
            <Image
                source={icon}
                resizeMode='contain'
                style={{ tintColor: color }} // Changed tintColor to style prop
                className="w-6 h-6"
                size={size ? size : 24}
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-12 text-center`} style={{ color: color }}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {

      const navigation = useNavigation();


  return (
   <>
    <Tabs
    screenOptions={{
        headerShown: false, // Added to remove the default header space
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFC300',
        tabBarInactiveTintColor: '#996B00',
        tabBarStyle: {
            backgroundColor: '#000814', // or white if you want
            borderTopWidth: 1,
            borderTopColor: '#996B00',
            height: 84,        // keep at a normal size
            position: 'absolute', // 👈 forces it to sit above content
        }
    }}
    >
        
        <Tabs.Screen name="Home"
        options={{
            Title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.home} color={color} name="Home" focused={focused}/>
            )
        }}
        />
        <Tabs.Screen name="Calculator"
        options={{
            Title: 'Caclulator',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.calculator} color={color} name="Calc" focused={focused}/>
            )
        }}
        />
    </Tabs>

    {/* <Image
    source={images.ChatBotImage}/> */}


        {/* Floating Chat Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('api/chatScreen')} // Navigate to the ChatScreen
        className="absolute bottom-24 right-1 p-4 rounded-full shadow-lg"
      >
            <Image
                source={images.ChatBotImage}
                resizeMode='contain'
                style={{ width: 75, height: 60 }} // Changed tintColor to style prop
            />

            <Text className="text-white text-center text-lg font-pbold -mt-1">Chat Bot</Text>

      </TouchableOpacity>

   </>
  )
}

export default TabsLayout