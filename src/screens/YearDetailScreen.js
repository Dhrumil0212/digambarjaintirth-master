import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Image, useWindowDimensions } from 'react-native';
import {
  fitContainer,
  ResumableZoom,
  useImageResolution,
} from 'react-native-zoom-toolkit';

const { width, height } = Dimensions.get('window');

const ZoomableImage = ({ uri }) => {
  const { isFetching, resolution } = useImageResolution({ uri });

  if (isFetching || resolution === undefined) {
    return null; // Show a loading indicator or placeholder if needed
  }

  const size = fitContainer(resolution.width / resolution.height, {
    width,
    height,
  });

  return (
    <ResumableZoom maxScale={resolution}>
      <Image source={{ uri }} style={{ ...size }} resizeMethod="scale" />
    </ResumableZoom>
  );
};

const YearDetailScreen = ({ route, navigation }) => {
  const { yearData } = route.params; // Get the year data passed from CalendarScreen

  // State to track whether the front or back image is displayed
  const [showFront, setShowFront] = useState(true);

  // Function to toggle the image between front and back
  const toggleImage = () => {
    setShowFront((prevState) => !prevState); // Toggle the state between true and false
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Display the front or back image based on the state */}
      <ZoomableImage uri={showFront ? yearData.calendar_data[0].front_url : yearData.calendar_data[0].back_url} />

      {/* Button to toggle between front and back images */}
      <TouchableOpacity onPress={toggleImage} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {showFront ? 'Show Back' : 'Show Front'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1, // Ensure the button is above images
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for button
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // Ensure button is on top of the image
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default YearDetailScreen;