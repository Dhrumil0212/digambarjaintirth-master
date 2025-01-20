// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider, useLanguage } from './src/services/LanguageContext'; // Import language context
import StatesGrid from './src/screens/StatesGrid'; // English Screen
import StatesGridHi from './src/screens/StatesGridHi'; // Hindi Screen
import PlacesGrid from './src/screens/PlacesGrid'; // English Screen
import PlacesGridHi from './src/screens/PlacesGridHi'; // Hindi Screen
import PlaceDetails from './src/screens/PlaceDetails'; // English Screen
import PlaceDetailsHi from './src/screens/PlaceDetailsHi'; // Hindi Screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { language } = useLanguage(); // Access language context

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
};

export default App;
