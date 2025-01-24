import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { getPlacesByState } from "../services/getStateENG"; // Fetch places for the state
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { HeartIcon } from "react-native-heroicons/solid";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlacesGrid = ({ route }) => {
  const { stateName } = route.params;
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch places data
    getPlacesByState(stateName).then((placesData) => {
      if (Array.isArray(placesData) && placesData.length > 0) {
        const transformedData = placesData.map((placeName) => {
          const decodedPlaceName = decodeURIComponent(placeName);
          const placeImage = imageMapping[stateName]?.[decodedPlaceName]?.[0] || null;
          return {
            "Name teerth": decodedPlaceName,
            image: placeImage ? decodeURIComponent(placeImage) : null,
          };
        });

        const uniquePlacesMap = new Map();

        transformedData.forEach((place) => {
          const nameTeerth = place["Name teerth"];
          if (nameTeerth && !uniquePlacesMap.has(nameTeerth)) {
            uniquePlacesMap.set(nameTeerth, place);
          }
        });

        const uniquePlaces = Array.from(uniquePlacesMap.values());
        setPlaces(uniquePlaces);
      }
    });

    // Load favorites from AsyncStorage
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, [stateName]);

  useEffect(() => {
    // Save favorites to AsyncStorage whenever the favorites list changes
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }
    };

    if (favorites.length > 0) {
      saveFavorites();
    }
  }, [favorites]);

  const filteredPlaces = places.filter(place =>
    place["Name teerth"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (placeName) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.includes(placeName)
        ? prev.filter((name) => name !== placeName)
        : [...prev, placeName];
      
      // Log favorites for debugging
      console.log('Updated Favorites:', updatedFavorites);

      return updatedFavorites;
    });
  };

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("PlaceDetails", {
          placeName: item["Name teerth"],
          stateName: stateName,
        })
      }
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Image not available</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item["Name teerth"]}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item["Name teerth"])} style={styles.favoriteButton}>
          <HeartIcon
            size={24}
            color={favorites.includes(item["Name teerth"]) ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const sortedPlaces = filteredPlaces.sort((a, b) => {
    const isAFavorite = favorites.includes(a["Name teerth"]);
    const isBFavorite = favorites.includes(b["Name teerth"]);
    if (isAFavorite && !isBFavorite) {
      return -1;
    }
    if (!isAFavorite && isBFavorite) {
      return 1;
    }
    return 0;
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <Text style={styles.heading}>{stateName} Tirthkshetras</Text>

            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* List */}
            <View style={styles.listContainer}>
              {filteredPlaces.length === 0 && searchQuery.length > 0 ? (
                <Text style={styles.noResults}>No places found</Text>
              ) : (
                <FlatList
                  data={sortedPlaces}
                  renderItem={renderPlaceCard}
                  numColumns={2}
                  keyExtractor={(item) => item["Name teerth"]}
                  contentContainerStyle={styles.grid}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: wp(4),
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: wp(6),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp(2),
    color: "#343a40",
  },
  grid: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    margin: wp(2),
    width: wp(42),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: hp(1),
  },
  cardImage: {
    width: "100%",
    height: hp(20),
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
  },
  placeholderText: {
    color: "#6c757d",
    fontSize: wp(4),
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: wp(2),
  },
  cardTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#343a40",
    textAlign: "left",
    flexWrap: "wrap",
    flex: 1,
    marginRight: wp(2),
    paddingBottom: hp(0.5),
  },
  favoriteButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: hp(2),
    fontSize: wp(4),
  },
  noResults: {
    fontSize: wp(4),
    color: "#6c757d",
    textAlign: "center",
    marginTop: hp(2),
  },
  listContainer: {
    flex: 1,
    marginTop: hp(1),
    marginBottom: wp(2),
  },
});

export default PlacesGrid;
