import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../services/LanguageContext"; // Import language context
import { getStates } from "../services/getStateENG"; // Fetch English state data
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const StatesGrid = () => {
  const { language, toggleLanguage } = useLanguage(); // Access language context
  const [states, setStates] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getStates().then((statesData) => {
      const sortedStates = statesData.sort((a, b) => a.name.localeCompare(b.name));
      const updatedStates = sortedStates.map((state) => ({
        ...state,
        image: imageMapping[state.name]?.image || null, // Get image URL from mapping
      }));
      setStates(updatedStates);
    });
  }, [language]); // Re-run when the language changes

  const renderStateCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
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

  const handleLanguageToggle = () => {
    toggleLanguage();
    navigation.reset({
      index: 0,
      routes: [{ name: language === 'en' ? 'StatesGridHi' : 'StatesGrid' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.heading}>{language === 'en' ? 'Bharat' : 'भारत'}</Text>
        
        {/* Language Toggle Button */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleLanguageToggle} // Use the updated toggle function
        >
          <Text style={styles.toggleButtonText}>
            {language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={states}
          renderItem={renderStateCard}
          numColumns={2}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.grid}
        />
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
    marginVertical: hp(2),
    color: "#343a40",
  },
  toggleButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  grid: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: hp(2),
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    margin: wp(2),
    width: wp(42),
    height: hp(27),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: hp(2),
    paddingBottom: hp(2),
    justifyContent: "space-between",
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
