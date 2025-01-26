import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../services/LanguageContext"; // Import language context
import { getStates } from "../services/getStateENG"; // Fetch English state data
import { getPlacesByState } from "../services/getStateENG"; // Fetch places by state
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSearch } from "../services/SearchContext"; // Import search context

const StatesGrid = () => {
  const { language, toggleLanguage } = useLanguage(); // Access language context
  const { searchQuery, handleSearch } = useSearch(); // Use search context
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const navigation = useNavigation();

  // Fetch states and places data when component mounts
  useEffect(() => {
    const fetchStatesAndPlaces = async () => {
      try {
        // Fetch states data
        const statesData = await getStates();
        const sortedStates = statesData.sort((a, b) => a.name.localeCompare(b.name));

        // Update states with images
        const updatedStates = sortedStates.map((state) => ({
          ...state,
          image: imageMapping[state.name]?.image || null,
        }));

        setStates(updatedStates);
        setFilteredStates(updatedStates);

        // Fetch unique places from all states
        let allPlacesSet = new Set();
        for (const state of statesData) {
          const placesData = await getPlacesByState(state.name);
          placesData.forEach((place) => {
            allPlacesSet.add(place); // Ensure uniqueness
          });
        }

        setAllPlaces(Array.from(allPlacesSet)); // Convert Set to array
      } catch (error) {
        console.error("Error fetching states and places:", error);
      }
    };

    fetchStatesAndPlaces();
  }, [language]);

  // Filter states and places based on search query
  useEffect(() => {
    if (searchQuery) {
      // Filter places based on the search query
      const filteredPlacesByQuery = allPlaces.filter((place) =>
        place.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredPlaces(filteredPlacesByQuery);
      setFilteredStates([]); // Clear states when search is present
    } else {
      setFilteredStates(states);
      setFilteredPlaces([]); // Clear places when search is empty
    }
  }, [searchQuery, states, allPlaces]);

  // Handle language toggle
  const handleLanguageToggle = () => {
    toggleLanguage();
    navigation.reset({
      index: 0,
      routes: [{ name: language === 'en' ? 'StatesGridHi' : 'StatesGrid' }],
    });
  };

  // Render state card
  const renderStateCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, searchQuery ? styles.cardContainerList : styles.cardContainerGrid]}
      onPress={() =>
        navigation.navigate(language === 'en' ? "PlacesGrid" : "PlacesGridHi", { stateName: item.name })
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
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render place card
  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, searchQuery ? styles.cardContainerList : styles.cardContainerGrid]}
      onPress={() =>
        navigation.navigate(language === 'en' ? "PlaceDetails" : "PlaceDetailsHi", { placeName: item })
      }
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.heading}>{language === 'en' ? 'Bharat' : 'भारत'}</Text>

        {/* Language Toggle Button */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleLanguageToggle}
        >
          <Text style={styles.toggleButtonText}>
            {language === 'en' ? 'HI' : 'EN'}
          </Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'en' ? "Search" : "राज्य या स्थान खोजें"}
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/* Conditionally render either list or grid */}
        {searchQuery ? (
          <View>
            {/* Display only places when searched */}
            {filteredPlaces.slice(0, 5).length > 0 && (
              <FlatList
                data={filteredPlaces.slice(0, 5)} // Only show the first 5 places
                renderItem={renderPlaceCard}
                keyExtractor={(item, index) => item + index}
                contentContainerStyle={styles.listWrapper}
              />
            )}
          </View>
        ) : (
          // States Grid when no search query
          filteredStates.length > 0 && (
            <FlatList
              data={filteredStates}
              renderItem={renderStateCard}
              numColumns={2}
              keyExtractor={(item, index) => item.name || index.toString()}
              contentContainerStyle={styles.grid}
            />
          )
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "flex-start",
    paddingHorizontal: wp(4),
  },
  safeAreaView: {
    flex: 1,
  },
  heading: {
    fontSize: wp(6),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: hp(3),
    color: "#343a40",
  },
  toggleButton: {
    position: 'absolute',
    top: hp(4),
    right: wp(4),
    backgroundColor: "#007bff",
    
   marginTop:hp(1),
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    zIndex: 1,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: hp(2),
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: wp(4),
  },
  listWrapper: {
    paddingTop: hp(3),
    paddingBottom: hp(2),
  },
  grid: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: hp(2),
    
  },
  cardContainer: {
    backgroundColor: "#fff",
    margin: wp(2),
    justifyContent: "space-between",
    marginTop: hp(1), // Add margin top
    marginBottom: hp(1)
  },
  cardContainerGrid: {
    borderRadius: wp(3),
    width: wp(42),
    height: hp(27),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    justifyContent: "space-between ", // Ensure content is centered in the card
    // alignItems: "center", 
    
  },
  cardContainerList: {
    width: "100%",
    height: hp(4.5),
    borderRadius: wp(2),
    backgroundColor: "#f1f1f1",
    marginBottom: hp(0.5),
    justifyContent: "center",
    shadowOpacity: 0,
    elevation: 0,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
  },
  cardTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
    color: "#343a40",
    textAlign: "center",
  },
});



export default StatesGrid;
