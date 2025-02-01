import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { HeartIcon } from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../services/LanguageContext';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [imageMapping, setImageMapping] = useState({}); // Store image mapping data
  const navigation = useNavigation();
  const { language, toggleLanguage } = useLanguage();

  // Fetch image mapping data when the component mounts or language changes
  useEffect(() => {
    const fetchImageMapping = async () => {
      try {
        const apiKey = "AIzaSyC1Fv_yJ-w7ifM4HIYr0GOG7Z5472GW1ZE"; // Your API key
        const spreadsheetId = "1CIfzUskea7CaZg9H5f8bi_ABjPMVrgUF29tmyeXkXyg"; // Your Google Sheets ID
        const range = "ImageMapping!A1:Z100000"; // Adjust the range if needed

        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        );
        const data = await response.json();

        if (!data.values) {
          console.error("No data found in the Google Sheets response");
          return {};
        }

        const imageMapping = {};
        const headerRow = data.values[0];
        const stateColumnIndex = headerRow.indexOf("State");
        const rajyaColumnIndex = headerRow.indexOf("Rajya"); // Hindi equivalent of State
        const placeColumnIndex = headerRow.indexOf("Place");
        const tirthColumnIndex = headerRow.indexOf("Tirth"); // Hindi equivalent of Place
        const imageColumnIndex = headerRow.indexOf("Link");

        if (
          stateColumnIndex === -1 ||
          rajyaColumnIndex === -1 ||
          placeColumnIndex === -1 ||
          tirthColumnIndex === -1 ||
          imageColumnIndex === -1
        ) {
          console.error("Required columns not found in the sheet.");
          return {};
        }

        data.values.slice(1).forEach((row) => {
          const stateName = language === 'en' ? row[stateColumnIndex] : row[rajyaColumnIndex]; // Use Rajya for Hindi
          const placeName = language === 'en' ? row[placeColumnIndex] : row[tirthColumnIndex]; // Use Tirth for Hindi
          const imageUrl = row[imageColumnIndex];

          if (stateName && placeName && imageUrl) {
            if (!imageMapping[stateName]) {
              imageMapping[stateName] = {};
            }
            if (!imageMapping[stateName][placeName]) {
              imageMapping[stateName][placeName] = [];
            }
            imageMapping[stateName][placeName].push(imageUrl);
          }
        });

        setImageMapping(imageMapping);
      } catch (error) {
        console.error("Error fetching image mapping from Google Sheets:", error);
      }
    };

    fetchImageMapping();

    // Load favorites from AsyncStorage
    const loadFavorites = async () => {
      try {
        const favoritesKey = language === 'en' ? 'favorites_en' : 'favorites_hi';
        const storedFavorites = await AsyncStorage.getItem(favoritesKey);
        
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, [language]);

  // Function to get the translated place name based on the current language
  const getTranslatedPlaceName = (placeName) => {
    // Iterate through the imageMapping object to find the translated place name
    for (const stateName in imageMapping) {
      if (imageMapping[stateName][placeName]) {
        return placeName; // The place name is already in the correct language
      }
    }
    return placeName; // Fallback to the original place name if not found
  };

  // Function to handle toggling the favorite status
  const handleToggleFavorite = async (placeName) => {
    try {
      let updatedFavorites;

      if (favorites.includes(placeName)) {
        updatedFavorites = favorites.filter((name) => name !== placeName);
      } else {
        updatedFavorites = [...favorites, placeName];
      }

      setFavorites(updatedFavorites);

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
        onPress={() => navigation.navigate('PlaceDetails', { placeName: item, language })}
      >
        <Text style={styles.cardTitle}>{getTranslatedPlaceName(item)}</Text>
        <TouchableOpacity
          onPress={() => handleToggleFavorite(item)}
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

      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>
          {language === 'en' ? 'No Favorites Yet' : 'अभी तक कोई पसंदीदा नहीं'}
        </Text>
      ) : (
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
  noFavoritesText: {
    fontSize: 18,
    textAlign: "center",
    color: "#6c757d",
  },
});

export default FavoritesScreen;