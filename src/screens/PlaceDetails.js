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
import { styles } from "../styles/placeStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import YoutubePlayer from "react-native-youtube-iframe"; // Import YouTube player

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
    const placeColumnIndex = headerRow.indexOf("Place");
    const tirthColumnIndex = headerRow.indexOf("Tirth");
    const rajyaColumnIndex = headerRow.indexOf("Rajya");
    const imageColumnIndex = headerRow.indexOf("Image");
    const linkColumnIndex = headerRow.indexOf("Link");

    if (
      stateColumnIndex === -1 ||
      placeColumnIndex === -1 ||
      tirthColumnIndex === -1 ||
      rajyaColumnIndex === -1 ||
      imageColumnIndex === -1 ||
      linkColumnIndex === -1
    ) {
      console.error("Required columns not found in the sheet.");
      return {};
    }

    data.values.slice(1).forEach((row) => {
      const state = row[stateColumnIndex];
      const place = row[placeColumnIndex];
      const tirth = row[tirthColumnIndex];
      const rajya = row[rajyaColumnIndex];
      const image = row[imageColumnIndex];
      const link = row[linkColumnIndex];

      if (language === 'en') {
        if (state && place && image) {
          if (!imageMapping[state]) {
            imageMapping[state] = {};
          }
          if (!imageMapping[state][place]) {
            imageMapping[state][place] = [];
          }
          imageMapping[state][place].push(link);
        }
      } else if (language === 'hi') {
        if (tirth && rajya && image) {
          if (!imageMapping[rajya]) {
            imageMapping[rajya] = {};
          }
          if (!imageMapping[rajya][tirth]) {
            imageMapping[rajya][tirth] = [];
          }
          imageMapping[rajya][tirth].push(link);
        }
      }
    });

    return imageMapping;
  } catch (error) {
    console.error("Error fetching image mapping from Google Sheets:", error);
    return {};
  }
};

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

    if (!data.values) {
      console.error("No data found in the Google Sheets response");
      return null;
    }

    const headerRow = data.values[0];
    const nameColumnIndex = language === 'hi' ? headerRow.indexOf('Naam') : headerRow.indexOf('Name teerth');
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
const fetchYouTubeLinksFromGoogleSheets = async (placeName, language) => {
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
    const placeNameColumnIndex = language === 'hi' ? headerRow.indexOf('PlaceHin') : headerRow.indexOf('Place');
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
  const { placeName, language = "en" } = route.params; // Default to English
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
      const youtubeLinks = await fetchYouTubeLinksFromGoogleSheets(placeName, language);
      const imageMappingData = await fetchImageMappingFromGoogleSheets(language);

      if (placeData) {
        setPlaceData(placeData);
      }
      setYoutubeLinks(youtubeLinks); // Set YouTube links

      // Load images for the place from imageMapping
      const foundImages = [];
      Object.keys(imageMappingData).forEach((stateOrRajya) => {
        if (imageMappingData[stateOrRajya][placeName]) {
          foundImages.push(...imageMappingData[stateOrRajya][placeName]);
        }
      });

      setImages(foundImages);
    };

    // Fetch place details, YouTube links, and image mapping
    if (placeName) {
      fetchData();
    }

    return () => unsubscribe();
  }, [placeName, language]);

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
      const translatedKey = language === 'hi' ? row[0] : row[1]; // Translated key (e.g., "Phone", "Email")
      const translatedValue = language === 'hi' ? row[2] : row[3]; // Translated value (the actual data like phone number, email, etc.)

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
      alert(language === 'hi' ? "मानचित्र निर्देशांक उपलब्ध नहीं हैं।" : "Map coordinates not available.");
    }
  };

  if (!placeData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#343a40" />
        <Text style={styles.loadingText}>
          {language === 'hi' ? "स्थान विवरण लोड हो रहा है..." : "Loading place details..."}
        </Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {language === 'hi' 
            ? "इंटरनेट कनेक्शन नहीं है। कृपया चित्र और वीडियो देखने के लिए इंटरनेट से कनेक्ट करें।" 
            : "No internet connection. Please connect to the internet to view images and videos."
          }
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{language === 'hi' ? placeData[0][6] : placeData[0][5]}</Text>

      {/* Image Slider */}
      <ScrollView horizontal style={styles.imageSlider}>
        {images.length > 0 ? (
          images.map((img, index) =>
            img ? (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ) : (
              <Text key={index} style={styles.noImageText}>
                {language === 'hi' ? "चित्र उपलब्ध नहीं है" : "Image not available"}
              </Text>
            )
          )
        ) : (
          <Text style={styles.noImageText}>
            {language === 'hi' ? "कोई चित्र उपलब्ध नहीं है" : "No images available"}
          </Text>
        )}
      </ScrollView>

      {/* YouTube Video Slider */}
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

      <View style={styles.infoContainer}>
        {renderPlaceData()}
        {placeData[0]?.[2] && placeData[0]?.[3] && (
          <TouchableOpacity style={styles.mapContainer} onPress={handleMapPress}>
            <Text style={styles.mapText}>
              {language === 'hi' ? "गूगल मैप्स में खोलें" : "Open in Google Maps"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;