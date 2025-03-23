import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import Bottom Tabs
import { Ionicons } from 'react-native-vector-icons'; // For icons
import { LanguageProvider, useLanguage } from './src/services/LanguageContext'; // Import language context
import { SearchProvider } from './src/services/SearchContext'; // Import SearchContext for global search
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
// Import unified screens
import StatesGrid from './src/screens/StatesGrid'; // Unified StatesGrid
import PlacesGrid from './src/screens/PlacesGrid'; // Unified PlacesGrid
import PlaceDetails from './src/screens/PlaceDetails'; // Unified PlaceDetails

// Import new screens for Bottom Navigation
import FavoritesScreen from './src/screens/FavoritesScreen'; // Unified FavoritesScreen
import InfoScreen from './src/screens/InfoScreen'; // Unified InfoScreen

// Import Calendar Screen
import CalendarScreen from './src/screens/CalendarScreen'; // Your Calendar screen
import YearDetailScreen from './src/screens/YearDetailScreen'; // Your Calendar screen

// Import Custom Drawer
import DrawerMenu from './src/screens/DrawerMenu'; // Custom Drawer component

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // Create Bottom Tab Navigator

// Tab Navigator
const BottomTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Favorites') {
            iconName = 'heart';
          } else if (route.name === 'Info') {
            iconName = 'information-circle';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={AppNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Info" component={InfoScreen} />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { language } = useLanguage(); // Access language context

  return (
    <Stack.Navigator
      initialRouteName="StatesGrid"
      screenOptions={{ headerShown: false }}
    >
      {/* Unified screens with language-based content */}
      <Stack.Screen
        name="StatesGrid"
        component={StatesGrid}
        key={language === 'en' ? 'StatesGrid-en' : 'StatesGrid-hi'}
      />
      <Stack.Screen
        name="PlacesGrid"
        component={PlacesGrid}
        key={language === 'en' ? 'PlacesGrid-en' : 'PlacesGrid-hi'}
      />
      <Stack.Screen
        name="PlaceDetails"
        component={PlaceDetails}
        key={language === 'en' ? 'PlaceDetails-en' : 'PlaceDetails-hi'}
      />
      {/* Add Calendar Screen to Stack Navigator */}
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="YearDetailScreen" component={YearDetailScreen} />

    </Stack.Navigator>
  );
};

// Main App Component
const App = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  return (
    <LanguageProvider>
      <SearchProvider>
        <NavigationContainer>
          {/* Show the custom drawer */}
          <DrawerMenu isVisible={drawerVisible} onClose={toggleDrawer} />
          
          {/* Tab Navigator to handle Home, Favorites, and Info */}
          <BottomTabs />

          {/* Hamburger Icon for Drawer Toggle */}
          
          
        </NavigationContainer>
      </SearchProvider>
    </LanguageProvider>
  );
};

export default App;
