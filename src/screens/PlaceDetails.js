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
import NetInfo from "@react-native-community/netinfo";
import { imageMapping } from "../config/imageMapping";
import { styles } from "../styles/placeStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import YoutubePlayer from "react-native-youtube-iframe"; // Import YouTube player

// Function to fetch place data from Google Sheets
const fetchPlaceDataFromGoogleSheets = async (placeName, language) => {
  try {
    const apiKey = "AIzaSyC1Fv_yJ-w7ifM4HIYr0GOG7Z5472GW1ZE"; // Your API key
    const spreadsheetId = "1CIfzUskea7CaZg9H5f8bi_ABjPMVrgUF29tmyeXkXyg";
    const range = "Sheet1!A1:Z600000"; // Adjust the range if needed

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
    );
    const data = await response.json();
    // console.log("API Response:", data); // Log the full API response for debugging

    if (!data.values) {
      console.error("No data found in the Google Sheets response");
      return null;
    }

    const headerRow = data.values[0];
    const nameColumnIndex = language === 'en' ? headerRow.indexOf('Name teerth') : headerRow.indexOf('Naam');
    const latitudeColumnIndex = headerRow.indexOf('latitude');
    const longitudeColumnIndex = headerRow.indexOf('longitude');
    const stateColumnIndex = headerRow.indexOf('State');
    const rajyaColumnIndex = headerRow.indexOf('Rajya');

    if (nameColumnIndex === -1 || latitudeColumnIndex === -1 || longitudeColumnIndex === -1) {
      console.error("Required columns not found in the sheet.");
      return null;
    }

    // Filter rows by place name
    const placeData = data.values.filter(
      (row) => row[nameColumnIndex] === placeName
    );

    if (placeData.length > 0) {
      return placeData; // Return place data (with latitude and longitude)
    } else {
      console.log(`No data found for place: ${placeName}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching place data from Google Sheets:", error);
    return null;
  }
};

// Function to fetch YouTube links from the YouTubeLinks sheet
const fetchYouTubeLinksFromGoogleSheets = async (placeName) => {
  try {
    const apiKey = "AIzaSyC1Fv_yJ-w7ifM4HIYr0GOG7Z5472GW1ZE"; // Your API key
    const spreadsheetId = "1CIfzUskea7CaZg9H5f8bi_ABjPMVrgUF29tmyeXkXyg";
    const range = "YouTube Links!A1:Z10000"; // Adjust the range if needed

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
    );
    const data = await response.json();

    if (!data.values) {
      console.error("No data found in the YouTubeLinks sheet");
      return [];
    }

    const headerRow = data.values[0];
    const placeNameColumnIndex = headerRow.indexOf('Place');
    const youtubeLinkColumnIndex = headerRow.indexOf('Video');

    if (placeNameColumnIndex === -1 || youtubeLinkColumnIndex === -1) {
      console.error("Required columns not found in the YouTubeLinks sheet.");
      return [];
    }

    // Filter rows by place name
    const youtubeLinks = data.values
      .slice(1) // Skip the header row
      .filter((row) => row[placeNameColumnIndex] === placeName)
      .map((row) => row[youtubeLinkColumnIndex]);

    return youtubeLinks.filter(link => link); // Filter out empty links
  } catch (error) {
    console.error("Error fetching YouTube links from Google Sheets:", error);
    return [];
  }
};

const PlaceDetails = ({ route }) => {
  const { placeName, language = "en" } = route.params; // Add language param
  const [placeData, setPlaceData] = useState(null);
  const [images, setImages] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([]); // State for YouTube links
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const fetchData = async () => {
      const placeData = await fetchPlaceDataFromGoogleSheets(placeName, language);
      const youtubeLinks = await fetchYouTubeLinksFromGoogleSheets(placeName);

      if (placeData) {
        setPlaceData(placeData);
      }
      setYoutubeLinks(youtubeLinks); // Set YouTube links
    };

    // Fetch place details and YouTube links
    if (placeName) {
      fetchData();
      loadImages(placeName);
    }

    return () => unsubscribe();
  }, [placeName, language]);

  // Load images for the place from imageMapping
  const loadImages = (place) => {
    let foundImages = [];
    Object.keys(imageMapping).forEach((state) => {
      if (imageMapping[state][place]) {
        foundImages = imageMapping[state][place];
      }
    });

    if (foundImages.length > 0) {
      setImages(foundImages);
    } else {
      setImages([]);
    }
  };

  // Helper function to check if the value is an email
  const isEmail = (str) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);

  // Helper function to check if the value is a URL
  const isURL = (str) => {
    const urlPattern = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    const wwwPattern = /^www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

    return urlPattern.test(str) || wwwPattern.test(str); // Match both "http(s)://" and "www."
  };

  // Render all fields from placeData
  const renderPlaceData = () => {
    if (!placeData) return null;

    return placeData.map((row, rowIndex) => {
      // Get translated key and value from the row
      const translatedKey = row[1]; // This should be the translated key (e.g., "Phone", "Email")
      const translatedValue = row[3]; // This should be the translated value (the actual data like phone number, email, etc.)

      let onPress = null;

      if (isEmail(translatedValue)) {
        onPress = () => Linking.openURL(`mailto:${translatedValue}`);
      } else if (isURL(translatedValue)) {
        const url = translatedValue.startsWith("www.") ? `https://${translatedValue}` : translatedValue;
        onPress = () => Linking.openURL(url);
      }

      return (
        <View key={rowIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{translatedKey}:</Text>
          {onPress ? (
            <TouchableOpacity onPress={onPress}>
              <Text style={[styles.textContent, styles.linkText]}>{translatedValue}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.textContent}>{translatedValue}</Text>
          )}
        </View>
      );
    });
  };

  const handleMapPress = () => {
    if (placeData?.[0]?.[2] && placeData?.[0]?.[3]) { // Access latitude and longitude from the data
      const mapUrl = `https://www.google.com/maps?q=${placeData[0][2]},${placeData[0][3]}`;
      Linking.openURL(mapUrl).catch((err) => {
        console.error("Error opening map:", err);
      });
    } else {
      alert("Map coordinates not available.");
    }
  };

  if (!placeData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#343a40" />
        <Text style={styles.loadingText}>Loading place details...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No internet connection. Please connect to the internet to view images and videos.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{placeData[0][5]}</Text>

      {/* Image Slider */}
      <ScrollView horizontal style={styles.imageSlider}>
        {images.length > 0 ? (
          images.map((img, index) =>
            img ? (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ) : (
              <Text key={index} style={styles.noImageText}>Image not available</Text>
            )
          )
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </ScrollView>

      {/* YouTube Video Slider */}
    

      <View style={styles.infoContainer}>
        {renderPlaceData()}
        {youtubeLinks.length > 0 && (
        <ScrollView horizontal style={styles.videoSlider}>
          {youtubeLinks.map((link, index) => (
            <View key={index} style={styles.videoContainer}>
              <YoutubePlayer
                height={200}
                width={300}
                videoId={link.split("v=")[1]} // Extract video ID from YouTube URL
                play={false} // Autoplay is disabled by default
              />
            </View>
          ))}
        </ScrollView>
      )}

        {placeData[0]?.[2] && placeData[0]?.[3] && (
          <TouchableOpacity style={styles.mapContainer} onPress={handleMapPress}>
            <Text style={styles.mapText}>Open in Google Maps</Text>

          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;