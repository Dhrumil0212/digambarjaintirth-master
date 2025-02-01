import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../services/LanguageContext"; // Import language context
import { getStates as getStatesEng, getPlacesByState as getPlacesByStateEng } from "../services/getStateENG"; // Fetch state and places data from Google Sheets (English)
import { getStates as getStatesHin, getPlacesByState as getPlacesByStateHin } from "../services/getStateHIN"; // Fetch state and places data from Google Sheets (Hindi)
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSearch } from "../services/SearchContext"; // Import search context

// Function to fetch image mapping data from Google Sheets
const fetchImageMappingFromGoogleSheets = async (language) => {
  try {
    const apiKey = "AIzaSyC1Fv_yJ-w7ifM4HIYr0GOG7Z5472GW1ZE"; // Your API key
    const spreadsheetId = "1CIfzUskea7CaZg9H5f8bi_ABjPMVrgUF29tmyeXkXyg";
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
    const rajyaColumnIndex = headerRow.indexOf("Rajya");
    const imageColumnIndex = headerRow.indexOf("Image");

    if (stateColumnIndex === -1 || imageColumnIndex === -1) {
      console.error("Required columns not found in the sheet.");
      return {};
    }

    data.values.slice(1).forEach((row) => {
      const stateName = language === 'en' ? row[stateColumnIndex] : row[rajyaColumnIndex];
      const imageUrl = row[imageColumnIndex];
      if (stateName && imageUrl) {
        imageMapping[stateName] = { image: imageUrl };
      }
    });

    // console.log("Image Mapping:", imageMapping); // Debug log
    return imageMapping;
  } catch (error) {
    console.error("Error fetching image mapping from Google Sheets:", error);
    return {};
  }
};

const StatesGrid = () => {
  const { language, toggleLanguage } = useLanguage(); // Access language context
  const { searchQuery, handleSearch } = useSearch(); // Use search context
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [imageMapping, setImageMapping] = useState({});
  const navigation = useNavigation();

  // Fetch states, places, and image mapping data when component mounts
  useEffect(() => {
    const fetchStatesAndPlaces = async () => {
      try {
        // Fetch image mapping data
        const imageMappingData = await fetchImageMappingFromGoogleSheets(language);
        setImageMapping(imageMappingData);

        // Fetch states data based on language
        const getStates = language === 'en' ? getStatesEng : getStatesHin;
        const getPlacesByState = language === 'en' ? getPlacesByStateEng : getPlacesByStateHin;

        const statesData = await getStates();
        const sortedStates = statesData.sort((a, b) => a.name.localeCompare(b.name));

        // Update states with images
        const updatedStates = sortedStates.map((state) => ({
          ...state,
          image: imageMappingData[state.name]?.image || null,
        }));

        // console.log("Updated States:", updatedStates); // Debug log
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
        console.error("Error fetching states, places, and image mapping:", error);
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
    toggleLanguage(); // Simply toggle the language
  };

  // Render state card
  const renderStateCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, searchQuery ? styles.cardContainerList : styles.cardContainerGrid]}
      onPress={() =>
        navigation.navigate("PlacesGrid", { stateName: item.name, language }) // Navigate to PlacesGrid
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
        navigation.navigate("PlaceDetails", { placeName: item, language }) // Navigate to PlaceDetails
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
    marginTop: hp(1),
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
    marginTop: hp(1),
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
    justifyContent: "space-between",
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