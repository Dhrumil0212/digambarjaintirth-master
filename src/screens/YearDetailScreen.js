import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ZoomableView } from '@dudigital/react-native-zoomable-view'; // Import ZoomableView

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const YearDetailScreen = ({ route, navigation }) => {
  const { yearData } = route.params; // Get the year data passed from CalendarScreen
  
  // State to track whether the front or back image is displayed
  const [showFront, setShowFront] = useState(true);

  // Function to toggle the image between front and back
  const toggleImage = () => {
    setShowFront(prevState => !prevState); // Toggle the state between true and false
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* ScrollView for images */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {yearData.calendar_data.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Pinch-to-zoom enabled Image using ZoomableView */}
            <ZoomableView
              maxZoom={2} // Maximum zoom level
              minZoom={1} // Minimum zoom level (no zoom)
              zoomStep={0.5} // Zoom step when pinching
              initialZoom={1} // Initial zoom level
            >
              <Image 
                source={{ uri: showFront ? item.front_url : item.back_url }} 
                style={styles.image} 
              />
            </ZoomableView>
          </View>
        ))}
      </ScrollView>

      {/* Button to toggle between front and back images */}
      <TouchableOpacity onPress={toggleImage} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {showFront ? 'Show Back' : 'Show Front'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
  scrollContainer: {
    alignItems: 'center', // Center images horizontally
    justifyContent: 'center',
    marginTop: 50, // Allow space for the back button
  },
  card: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: width, // Make image width equal to the screen width
    height: height, // Make image height equal to the screen height
    resizeMode: 'contain', // Ensures the image fits within the screen without being cropped
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
