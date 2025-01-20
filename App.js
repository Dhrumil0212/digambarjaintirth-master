import React, { useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';  // Import the splash screen module
import StatesGrid from './src/screens/StatesGrid';
import StatesGridHi from './src/screens/StatesGridHi';
import PlacesGrid from './src/screens/PlacesGrid';
import PlacesGridHi from './src/screens/PlacesGridHi';

import PlaceDetails from './src/screens/PlaceDetails';
import PlaceDetailsHi from './src/screens/PlaceDetailsHi';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const loadResources = async () => {
      try {
        // Prevent the splash screen from auto hiding
        SplashScreen.preventAutoHideAsync();
        
        // Here you can load your resources like data, fonts, etc.
        // e.g., await loadDataAsync();

      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen when loading is done
        SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, []);  // This will run once when the app mounts

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StatesGridHi"  screenOptions={{headerShown:false}}>
        <Stack.Screen name="StatesGridHi" component={StatesGridHi} />
        <Stack.Screen name="PlacesGridHi" component={PlacesGridHi} />
        <Stack.Screen name="PlaceDetailsHi" component={PlaceDetailsHi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
