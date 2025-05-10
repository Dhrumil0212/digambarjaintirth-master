import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../services/LanguageContext';
import { getStates as getStatesEng, getPlacesByState as getPlacesByStateEng } from '../services/getStateENG';
import { getStates as getStatesHin, getPlacesByState as getPlacesByStateHin } from '../services/getStateHIN';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSearch } from '../services/SearchContext';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import CustomDrawer from './DrawerMenu';

const StatesGrid = () => {
  const { language, toggleLanguage } = useLanguage();
  const { searchQuery, handleSearch } = useSearch();
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [imageMapping, setImageMapping] = useState({});
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStatesAndPlaces = async () => {
      try {
        const imageMappingData = await fetchImageMappingFromGoogleSheets(language);
        setImageMapping(imageMappingData);

        const getStates = language === 'en' ? getStatesEng : getStatesHin;
        const getPlacesByState = language === 'en' ? getPlacesByStateEng : getPlacesByStateHin;

        const statesData = await getStates();
        const sortedStates = statesData.sort((a, b) => a.name.localeCompare(b.name));

        const updatedStates = sortedStates.map((state) => ({
          ...state,
          image: imageMappingData[state.name]?.image || null,
        }));

        setStates(updatedStates);
        setFilteredStates(updatedStates);

        let allPlacesSet = new Set();
        for (const state of statesData) {
          const placesData = await getPlacesByState(state.name);
          placesData.forEach((place) => {
            allPlacesSet.add(place);
          });
        }

        setAllPlaces(Array.from(allPlacesSet));
      } catch (error) {
        console.error("Error fetching states, places, and image mapping:", error);
      }
    };

    fetchStatesAndPlaces();
  }, [language]);

  useEffect(() => {
    if (searchQuery) {
      const filteredPlacesByQuery = allPlaces.filter((place) =>
        place.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlaces(filteredPlacesByQuery);
      setFilteredStates([]);
    } else {
      setFilteredStates(states);
      setFilteredPlaces([]);
    }
  }, [searchQuery, states, allPlaces]);

  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  const fetchImageMappingFromGoogleSheets = async (language) => {
    try {
      const apiKey = "AIzaSyC1Fv_yJ-w7ifM4HIYr0GOG7Z5472GW1ZE";
      const spreadsheetId = "1CIfzUskea7CaZg9H5f8bi_ABjPMVrgUF29tmyeXkXyg";
      const range = "ImageMapping!A1:Z100000";

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
      );
      const data = await response.json();

      if (!data.values) return {};

      const imageMapping = {};
      const headerRow = data.values[0];
      const stateColumnIndex = headerRow.indexOf("State");
      const rajyaColumnIndex = headerRow.indexOf("Rajya");
      const imageColumnIndex = headerRow.indexOf("Image");

      if (stateColumnIndex === -1 || imageColumnIndex === -1) return {};

      data.values.slice(1).forEach((row) => {
        const stateName = language === 'en' ? row[stateColumnIndex] : row[rajyaColumnIndex];
        const imageUrl = row[imageColumnIndex];
        if (stateName && imageUrl) {
          imageMapping[stateName] = { image: imageUrl };
        }
      });

      return imageMapping;
    } catch (error) {
      console.error("Error fetching image mapping from Google Sheets:", error);
      return {};
    }
  };

  const renderStateCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, searchQuery ? styles.cardContainerList : styles.cardContainerGrid]}
      onPress={() => navigation.navigate("PlacesGrid", { stateName: item.name, language })}
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

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, styles.cardContainerList]}
      onPress={() => navigation.navigate("PlaceDetails", { placeName: item, language })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.placeCardTitle}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setIsDrawerVisible(true)} 
            style={styles.hamburgerIcon}
          >
            <MaterialCommunityIcons name="menu" size={wp(6)} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.heading}>{language === 'en' ? 'Bharat' : 'भारत'}</Text>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={handleLanguageToggle}
          >
            <Text style={styles.toggleButtonText}>
              {language === 'en' ? 'HI' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder={language === 'en' ? "Search" : "राज्य या स्थान खोजें"}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {searchQuery ? (
          <View>
            {filteredPlaces.slice(0, 5).length > 0 && (
              <FlatList
                data={filteredPlaces.slice(0, 5)}
                renderItem={renderPlaceCard}
                keyExtractor={(item, index) => item + index}
                contentContainerStyle={styles.listWrapper}
              />
            )}
          </View>
        ) : (
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

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeAreaView: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  heading: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    flex: 1,
  },
  hamburgerIcon: {
    backgroundColor: '#007bff',
    padding: wp(2),
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: wp(1),
    padding: wp(3),
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: wp(4),
    color: '#333',
  },
  listWrapper: {
    paddingBottom: hp(2),
  },
  grid: {
    paddingBottom: hp(2),
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: wp(2),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContainerGrid: {
    width: wp(42),
    height: hp(27),
    margin: wp(2),
  },
  cardContainerList: {
    width: '100%',
    height: hp(6),
    marginBottom: hp(1),
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: hp(20),
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  placeholderText: {
    color: '#6c757d',
    fontSize: wp(3.5),
    fontWeight: 'bold',

  },
  cardContent: {
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#343a40',
    textAlign: 'center',
    fontWeight: 'bold',
    maxWidth: '100%',
    marginTop:hp(1)



  },
  placeCardTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#343a40',
    textAlign: 'center',
    paddingHorizontal: wp(2),
  },
});

export default StatesGrid;