import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { getPlaceByName } from "../services/getStateENG";
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import { styles } from "../styles/placeStyles"; // Assuming styles are defined here
import NetInfo from "@react-native-community/netinfo"; // To check internet connectivity
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import finalData from "../data/final.json"; // Assuming this holds some place-related data

const PlaceDetails = ({ route }) => {
  const { placeName } = route.params; // Only extract placeName from params

  const [place, setPlace] = useState(null);
  const [images, setImages] = useState([]);
  const [isConnected, setIsConnected] = useState(true); // Track internet connection status

  useEffect(() => {
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Fetch place details and images based on placeName only
    if (placeName) {
      // First, fetch the place details
      getPlaceByName(placeName)
        .then((placeData) => {
          setPlace(placeData);
          loadImages(placeName); // Load images for the place when data is fetched
        })
        .catch(() => setPlace({ error: true }));

      // Ensure the images are loaded correctly for the place
      loadImages(placeName); // Added here to ensure images are loaded correctly
    }

    return () => unsubscribe(); // Clean up the network listener
  }, [placeName]); // Depend on placeName to reload data when params change

  // Load images for the place from imageMapping
  const loadImages = (place) => {
    console.log("Searching for images for place:", place);

    // Iterate over imageMapping and look for the place in any state
    let foundImages = [];
    Object.keys(imageMapping).forEach((state) => {
      // If images are available for this place, add them to foundImages
      if (imageMapping[state][place]) {
        foundImages = imageMapping[state][place];
      }
    });

    if (foundImages.length > 0) {
      console.log("Found images for place:", foundImages);
      setImages(foundImages); // Set the images for this place
    } else {
      console.log("No images found for place:", place);
      setImages([]); // Ensure we clear any images if not found
    }
  };

  // Helper function to check if the value is an email
  const isEmail = (str) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(str);
  };

  // Helper function to check if the value is a URL (supports "www" as well)
  const isURL = (str) => {
    const urlPattern = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    const wwwPattern = /^www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

    return urlPattern.test(str) || wwwPattern.test(str); // Match both "http(s)://" and "www."
  };

  // Render fields for additional place-related data from finalData
  const renderFields = (placeName) => {
    const placeData = finalData.Sheet1.filter(
      (item) => item["Name teerth"] === placeName
    );

    if (placeData.length === 0) return null;

    const uniqueFields = {};
    placeData.forEach((item) => {
      if (
        item["Key"] === "Formatted Text" ||
        item["Key"] === "Original Value" ||
        item["Key"] === "Tirth" ||
        item["Key"] === "Name teerth" ||
        item["Key"] === "Naam" ||
        item["Key"] === "State" ||
        item["Key"] === "Rajya"
      ) {
        return;
      }

      const key = item["Translated Key"] || item["Key"];
      const value = item["Translated Value"] || item["Original Value"];
      if (!uniqueFields[key]) {
        uniqueFields[key] = value;
      }
    });

    return Object.keys(uniqueFields).map((key) => {
      const value = uniqueFields[key];
      let onPress = null;

      // Check if the value is an email or URL and set the onPress handler accordingly
      if (isEmail(value)) {
        onPress = () => Linking.openURL(`mailto:${value}`);
      } else if (isURL(value)) {
        // If it's a URL starting with "www", add "https://" before opening
        const url = value.startsWith("www.") ? `https://${value}` : value;
        onPress = () => Linking.openURL(url);
      }

      return (
        <View key={key} style={styles.section}>
          <Text style={[styles.sectionTitle]}>
            {key}:
          </Text>
          {onPress ? (
            <TouchableOpacity onPress={onPress}>
              <Text style={[styles.textContent, styles.linkText]}>
                {value}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.textContent]}>{value}</Text>
          )}
        </View>
      );
    });
  };

  // Handle error in loading image (if the image fails to load)
  const handleImageError = (index) => {
    console.log(`Failed to load image at index ${index}`);
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages.filter((img) => img !== null);
    });
  };

  // Handle opening place location in Google Maps
  const handleMapPress = () => {
    if (place.latitude && place.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
      Linking.openURL(mapUrl).catch((err) => {
        console.error("Error opening map:", err);
      });
    }
  };

  // Show loading screen while fetching data
  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#343a40" />
        <Text style={styles.loadingText}>Loading place details...</Text>
      </View>
    );
  }

  // Error handling if place data could not be fetched
  if (place.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load place details. Please try again later.
        </Text>
      </View>
    );
  }

  // Show message if there's no internet connection
  if (!isConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No internet connection. Please connect to the internet to view images.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.heading]}>
        {place["Name teerth"]}
      </Text>

      {/* Image Slider */}
      <ScrollView horizontal style={styles.imageSlider}>
        {images.length > 0 ? (
          images.map((img, index) =>
            img ? (
              <Image
                key={index}
                source={{ uri: img }} // Display image from the URL
                style={styles.image}
                onError={() => handleImageError(index)} // Handle image load failure
              />
            ) : (
              <Text key={index} style={styles.noImageText}>
                Image not available
              </Text>
            )
          )
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </ScrollView>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {renderFields(place["Name teerth"])}

        {/* Map Button */}
        {place.latitude && place.longitude && (
          <TouchableOpacity
            style={styles.mapContainer}
            onPress={handleMapPress}
          >
            <Text style={[styles.mapText]}>
              Open in Google Maps
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};


export default PlaceDetails;
