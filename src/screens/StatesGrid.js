import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSearch } from "../services/SearchContext"; // Import search context
import { useLanguage } from "../services/LanguageContext"; // Import language context
import { getStates } from "../services/getStateENG"; // Fetch English state data
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const StatesGrid = () => {
  const { language } = useLanguage();
  const { searchQuery, handleSearch } = useSearch();
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await getStates();
        const sortedStates = statesData.sort((a, b) => a.name.localeCompare(b.name));
        const updatedStates = sortedStates.map((state) => ({
          ...state,
          image: imageMapping[state.name]?.image || null,
        }));
        setStates(updatedStates);
        setFilteredStates(updatedStates);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, [language]);

  useEffect(() => {
    if (searchQuery) {
      const filteredBySearch = states.filter(state =>
        state.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStates(filteredBySearch);
    } else {
      setFilteredStates(states);
    }
  }, [searchQuery, states]);

  const renderStateCard = ({ item }) => (
    <View style={styles.cardContainer}>
      {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
      <Text style={styles.cardTitle}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search States"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredStates}
        renderItem={renderStateCard}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: hp(2),
  },
  cardContainer: {
    backgroundColor: "#fff",
    margin: wp(2),
    padding: wp(4),
    borderRadius: 5,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: wp(4),
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default StatesGrid;
