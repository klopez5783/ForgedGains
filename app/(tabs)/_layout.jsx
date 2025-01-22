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
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-12 text-center`}>
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
        tabBarShowLabel: false,
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
        <Tabs.Screen name="Profile"
        options={{
            Title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused}/>
            )
        }}
        />
        <Tabs.Screen name="Start"
        options={{
            Title: 'Start',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.play} color={color} name="Start" focused={focused}/>
            )
        }}
        />
    </Tabs>
   </>
  )
}

export default TabsLayout