import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { HeartIcon } from 'react-native-heroicons/solid'; // Heart Icon for favorites
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for storing favorites
import { useNavigation } from '@react-navigation/native'; // Navigation hook
import { useLanguage } from '../services/LanguageContext'; // Language context

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);  // State to store favorites
  const navigation = useNavigation();  // Access the navigation prop
  const { language, toggleLanguage } = useLanguage();  // Language context

  // Load favorites based on current language when the component mounts or language changes
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Choose the favorites key based on the current language
        const favoritesKey = language === 'en' ? 'favorites_en' : 'favorites_hi';
        const storedFavorites = await AsyncStorage.getItem(favoritesKey);
        
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));  // Load favorites into state
        } else {
          setFavorites([]); // No favorites yet
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();  // Load favorites when screen is mounted or language is changed
  }, [language]);  // Trigger the effect whenever the language changes

  // Function to handle navigation to the PlaceDetails screen when a favorite is clicked
  const handlePlaceClick = (placeName) => {
    // Navigate to the PlaceDetails screen and pass the place name as a parameter
    navigation.navigate('PlaceDetails', { placeName, language });
  };

  // Function to handle toggling the favorite status (add/remove) of a place
  const handleToggleFavorite = async (placeName) => {
    try {
      let updatedFavorites;

      // If the place is already in favorites, remove it
      if (favorites.includes(placeName)) {
        updatedFavorites = favorites.filter(item => item !== placeName);
      } else {
        // If the place is not in favorites, add it
        updatedFavorites = [...favorites, placeName];
      }

      setFavorites(updatedFavorites);  // Update the favorites state

      // Save the updated list to AsyncStorage based on the current language
      const favoritesKey = language === 'en' ? 'favorites_en' : 'favorites_hi';
      await AsyncStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Render a single favorite item in the list
  const renderFavoriteCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={styles.favoriteCard} 
        onPress={() => handlePlaceClick(item)} // Navigate to PlaceDetails on click
      >
        <Text style={styles.cardTitle}>{item}</Text>
        <TouchableOpacity
          onPress={() => handleToggleFavorite(item)} // Toggle favorite on heart icon click
        >
          <HeartIcon size={24} color={favorites.includes(item) ? "red" : "gray"} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {language === 'en' ? 'Favorites' : 'पसंदीदा'}
      </Text>

      {/* Language Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleLanguage}
      >
        <Text style={styles.toggleButtonText}>
          {language === 'en' ? 'HI' : 'EN'}
        </Text>
      </TouchableOpacity>

      {/* Display no favorites message if the list is empty */}
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>
          {language === 'en' ? 'No Favorites Yet' : 'अभी तक कोई पसंदीदा नहीं'}
        </Text>
      ) : (
        // Display favorites list if there are any
        <FlatList
          data={favorites}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
    marginTop: 35,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  favoriteCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  toggleButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    zIndex: 1,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: "center",
    color: "#6c757d",
  },
});

export default FavoritesScreen;