import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'

function TabIcon({ icon, color, name, focused }) {
    return (
        <View className="items-center justify-center mt-4">
            <Image
                source={icon}
                resizeMode='contain'
                style={{ tintColor: color }} // Changed tintColor to style prop
                className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-12 text-center`} style={{ color: color }}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
   <>
    <Tabs
    screenOptions={{
        headerShown: false, // Added to remove the default header space
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFC300',
        tabBarInactiveTintColor: '#996B00',
        tabBarStyle: {
            backgroundColor: '#000814',
            borderTopWidth: 1,
            borderTopColor: '#996B00',
            height: 84,
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
                <TabIcon icon={icons.play} color={color} name="Calculator" focused={focused}/>
            )
        }}
        />
    </Tabs>
   </>
  )
}

export default TabsLayout