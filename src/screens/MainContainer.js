import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import unified screens
import StatesGrid from './screens/StatesGrid'; // Unified StatesGrid
import PlacesGrid from './screens/PlacesGrid'; // Unified PlacesGrid
import FavoritesScreen from './screens/FavoritesScreen'; // Unified FavoritesScreen
import InfoScreen from './screens/InfoScreen'; // Unified InfoScreen

// Define screen names for clarity
const homeName = "StatesGrid";
const placesName = "PlacesGrid";
const infoName = "Info";
const favoritesName = "Favorites";

const Tab = createBottomTabNavigator();

function MainContainer() {
  const [favorites, setFavorites] = useState([]); // State for storing favorites
  const [language, setLanguage] = useState('en'); // Default language is English

  useEffect(() => {
    // Load language preference and favorites from AsyncStorage when the app starts
    const loadPreferences = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    };

    loadPreferences();
  }, []); // Empty dependency array ensures this runs only once

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
              iconName = focused ? 'map' : 'map-outline'; // Using map for places
            } else if (rn === infoName) {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (rn === favoritesName) {
              iconName = focused ? 'heart' : 'heart-outline'; // Heart icon for favorites
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
        <Tab.Screen
          name={favoritesName}
          component={FavoritesScreen}
          initialParams={{ favorites: favorites || [] }} // Pass favorites as initialParams
        />
        <Tab.Screen name={infoName} component={InfoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;