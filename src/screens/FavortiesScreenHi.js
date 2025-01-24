import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { HeartIcon } from 'react-native-heroicons/solid'; // Heart Icon for favorites
import AsyncStorage from '@react-native-async-storage/async-storage';  // AsyncStorage to persist favorites
import { useNavigation } from '@react-navigation/native'; // For navigation

const FavoritesHiScreen = () => {
  const [favorites, setFavorites] = useState([]);  // State to store favorites
  const navigation = useNavigation();  // For navigation to PlaceDetailsHi screen

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoritesHi');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));  // Load favorites from AsyncStorage
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();  // Load favorites when the component mounts
  }, []);  // Empty dependency array ensures it runs only once

  const handlePlaceClick = (placeName) => {
    navigation.navigate('PlaceDetailsHi', { placeName }); // Navigate to PlaceDetailsHi with place name
  };

  const handleToggleFavorite = async (placeName) => {
    try {
      let updatedFavorites;

      // Remove from favorites if already exists
      if (favorites.includes(placeName)) {
        updatedFavorites = favorites.filter(item => item !== placeName);
      } else {
        // Add to favorites if not already there
        updatedFavorites = [...favorites, placeName];
      }

      setFavorites(updatedFavorites);  // Update the favorites state

      // Save updated favorites in AsyncStorage
      await AsyncStorage.setItem('favoritesHi', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // If there are no favorites, display a message
  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>कोई पसंदीदा स्थल नहीं है</Text> {/* No favorites message */}
      </View>
    );
  }

  const renderFavoriteCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.favoriteCard}
        onPress={() => handlePlaceClick(item)} // Navigate to PlaceDetailsHi on click
      >
        <Text style={styles.cardTitle}>{item}</Text>
        <TouchableOpacity
          onPress={() => handleToggleFavorite(item)} // Toggle favorite on heart icon click
        >
          <HeartIcon
            size={24}
            color={favorites.includes(item) ? "red" : "gray"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>आपकी पसंदीदा स्थल</Text> {/* Heading */}
      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
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
});

export default FavoritesHiScreen;
