import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { HeartIcon } from "react-native-heroicons/solid";

const FavoritesScreen = ({ route, navigation }) => {
  // Ensure 'favorites' is passed correctly or fallback to an empty array
  const { favorites = [] } = route.params || {};

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No Favorites Yet</Text>
      </View>
    );
  }

  const renderFavoriteCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("PlaceDetails", { placeName: item })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item}</Text>
        <HeartIcon size={24} color="red" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorites</Text>
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
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#343a40",
  },
  listContainer: {
    flex: 1,
  },
});

export default FavoritesScreen;
