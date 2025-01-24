import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your existing screens
import StatesGrid from './screens/StatesGrid';  // Assuming this is the main screen
import PlacesGrid from './screens/PlacesGrid';  // Another screen for places
import SettingsScreen from './screens/SettingsScreen';  // A screen for settings

// Define screen names for clarity
const homeName = "StatesGrid";
const placesName = "PlacesGrid";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            // Set icons based on the active tab
            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (rn === placesName) {
              iconName = focused ? 'map' : 'map-outline';  // Using map for places
            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // Return the corresponding Ionicon
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70 },
        }}
      >
        <Tab.Screen name={homeName} component={StatesGrid} />
        <Tab.Screen name={placesName} component={PlacesGrid} />
        <Tab.Screen name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
