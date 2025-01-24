import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import Bottom Tabs
import { Ionicons } from 'react-native-vector-icons'; // For icons
import { LanguageProvider, useLanguage } from './src/services/LanguageContext'; // Import language context
import { SearchProvider } from './src/services/SearchContext'; // Import SearchContext for global search

// Import screens for both English and Hindi versions
import StatesGrid from './src/screens/StatesGrid'; // English Screen
import StatesGridHi from './src/screens/StatesGridHi'; // Hindi Screen
import PlacesGrid from './src/screens/PlacesGrid'; // English Screen
import PlacesGridHi from './src/screens/PlacesGridHi'; // Hindi Screen
import PlaceDetails from './src/screens/PlaceDetails'; // English Screen
import PlaceDetailsHi from './src/screens/PlaceDetailsHi'; // Hindi Screen

// Import new screens for Bottom Navigation
import FavoritesScreen from './src/screens/FavoritesScreen'; // New screen for Favorites
import InfoScreen from './src/screens/InfoScreen'; // New screen for Info

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // Create Bottom Tab Navigator

const BottomTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={ ({ route }) => ({
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
        headerShown:false
      })}
      
    >
      <Tab.Screen name="Home" component={AppNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Info" component={InfoScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { language } = useLanguage(); // Access language context

  return (
    <Stack.Navigator
      initialRouteName={language === 'en' ? 'StatesGrid' : 'StatesGridHi'}
      screenOptions={{ headerShown: false }}
    >
      {/* Language-based screen routing with unique key */}
      <Stack.Screen
        name="StatesGrid"
        component={StatesGrid}
        key={language === 'en' ? 'StatesGrid-en' : 'StatesGrid-hi'}
      />
      <Stack.Screen
        name="StatesGridHi"
        component={StatesGridHi}
        key={language === 'en' ? 'StatesGrid-en' : 'StatesGrid-hi'}
      />
      <Stack.Screen
        name="PlacesGrid"
        component={PlacesGrid}
        key={language === 'en' ? 'PlacesGrid-en' : 'PlacesGrid-hi'}
      />
      <Stack.Screen
        name="PlacesGridHi"
        component={PlacesGridHi}
        key={language === 'en' ? 'PlacesGrid-en' : 'PlacesGrid-hi'}
      />
      <Stack.Screen
        name="PlaceDetails"
        component={PlaceDetails}
        key={language === 'en' ? 'PlaceDetails-en' : 'PlaceDetails-hi'}
      />
      <Stack.Screen
        name="PlaceDetailsHi"
        component={PlaceDetailsHi}
        key={language === 'en' ? 'PlaceDetails-en' : 'PlaceDetails-hi'}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <SearchProvider>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </SearchProvider>
    </LanguageProvider>
  );
};

export default App;
