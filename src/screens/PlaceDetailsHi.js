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
import { getPlaceByName } from "../services/getStateHIN";
import { imageMapping } from "../config/imageMappingHi";
import { styles } from "../styles/placeStyles";
import { stateMapping } from "../config/stateMapHi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import finalData from "../data/final.json";
import NetInfo from "@react-native-community/netinfo"; // इंटरनेट कनेक्टिविटी चेक करने के लिए

const PlaceDetails = ({ route }) => {
  const { placeName, stateName } = route.params;

  const [place, setPlace] = useState(null);
  const [images, setImages] = useState([]);
  const [isConnected, setIsConnected] = useState(true); // इंटरनेट कनेक्शन स्थिति ट्रैक करना

  useEffect(() => {
    // नेटवर्क स्थिति चेक करें
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // स्थान डेटा और चित्र लोड करें
    getPlaceByName(placeName)
      .then((placeData) => {
        setPlace(placeData);
        loadImages(stateName, placeName);
      })
      .catch(() => setPlace({ error: true }));

    return () => unsubscribe(); // साफ करने के लिए NetInfo से अनसब्सक्राइब करें
  }, [placeName, stateName]);

  const loadImages = (state, place) => {
    if (!state || !imageMapping[state]) return;

    const placeImages = imageMapping[state]?.[place];
    if (placeImages?.length > 0) {
      setImages(placeImages);
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
      (item) => item["Naam"] === placeName
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

      const key = item["Key"] || item["Translated Key"];
      const value = item["Original Value"] || item["Translated Value"];
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
          <Text style={styles.sectionTitle}>
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

  const handleImageError = (index) => {
    console.log(`चित्र लोड करने में विफल रहा है, इंडेक्स ${index}`);
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages.filter((img) => img !== null);
    });
  };

  const handleMapPress = () => {
    if (place.latitude && place.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
      
      // ब्राउज़र या गूगल मैप्स ऐप में मानचित्र खोलें
      Linking.openURL(mapUrl).catch((err) => {
        console.error("मानचित्र खोलने में त्रुटि:", err);
      });
    }
  };

  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#343a40" />
        <Text style={styles.loadingText}>स्थान विवरण लोड हो रहा है...</Text>
      </View>
    );
  }

  if (place.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          स्थान विवरण लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।
        </Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          इंटरनेट कनेक्शन नहीं है। कृपया चित्र देखने के लिए इंटरनेट से कनेक्ट करें।
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{place["Naam"]}</Text>

      {/* चित्र स्लाइडर */}
      <ScrollView horizontal style={styles.imageSlider}>
        {images.length > 0 ? (
          images.map((img, index) =>
            img ? (
              <Image
                key={index}
                source={{ uri: img }} // चित्र को URL से लोड करें
                style={styles.image}
                onError={() => handleImageError(index)}
              />
            ) : (
              <Text key={index} style={styles.noImageText}>
                चित्र उपलब्ध नहीं है
              </Text>
            )
          )
        ) : (
          <Text style={styles.noImageText}>कोई चित्र उपलब्ध नहीं है</Text>
        )}
      </ScrollView>

      {/* जानकारी कंटेनर */}
      <View style={styles.infoContainer}>
        {renderFields(place["Naam"])}

        {/* मानचित्र बटन */}
        {place.latitude && place.longitude && (
          <TouchableOpacity
            style={styles.mapContainer}
            onPress={handleMapPress}
          >
            <Text style={styles.mapText}>गूगल मैप्स में खोलें</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};



export default PlaceDetails;
