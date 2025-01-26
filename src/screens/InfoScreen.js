import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList, Dimensions } from 'react-native';

// Sample data for photos and details of other developers
const otherDevelopers = [
  { id: '1', name: 'मार्गदर्शन: पूज्य मुनि श्री अभय सागर जी महाराज', image: 'https://vidyasagarmedia.s3.us-east-2.amazonaws.com/monthly_2023_02/large.(12).JPG.e9b47927b0e219572d0876f9d7980f0b.JPG' },
  { id: '2', name: 'प्रेरणा स्तोत्र : ब्र.अनिल कुमार जैन', image: 'https://i.imgur.com/myI1zBY.jpeg' }
  
  // Add more developer objects if needed
];

const { width } = Dimensions.get('window'); // Get screen width to make responsive design

const InfoScreen = () => {
  // Handle link opening
  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Main Developer's Contact Info */}
      <Text style={styles.header}>Contact Information</Text>
      <View style={styles.contactInfoContainer}>
        <View style={styles.contactTextContainer}>
          <Text style={styles.developerName}>ध्रुमिल जैन</Text>
          <Text style={styles.developerEmail}>Email: dhrumil0212@gmail.com</Text>
        </View>
      </View>

      {/* Larger Photo above other developers */}
      <View style={styles.largePhotoContainer}>
        <Image
          source={{ uri: 'https://i.imgur.com/rRlo8gx.jpeg' }} // Replace with your desired larger image URL
          style={styles.largePhoto}
        />
      </View>

      {/* Grid of Other Developers */}
      <FlatList
        data={otherDevelopers}
        renderItem={({ item }) => (
          <View style={styles.photoCard}>
            <Image source={{ uri: item.image }} style={styles.photoImage} />
            <Text style={styles.photoName}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal={true} // Horizontal list
        contentContainerStyle={styles.photoGrid}
        showsHorizontalScrollIndicator={false} // Optional: hides the scroll indicator
      />

      {/* Google Form Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => handleOpenLink('https://forms.gle/yourGoogleFormLink1')} style={styles.linkButton}>
          <Text style={styles.linkText}>Fill out Form 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOpenLink('https://forms.gle/yourGoogleFormLink2')} style={styles.linkButton}>
          <Text style={styles.linkText}>Fill out Form 2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  contactInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  developerEmail: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  largePhotoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  largePhoto: {
    width: '100%', // Make the large image take the full width of the screen
    height: 250, // Set height as undefined for proper scaling
    aspectRatio: 0.5, // Aspect ratio for the image (adjust as needed, 1.5 is just an example)
    borderRadius: 15,
  },
  photoGrid: {
    flexDirection: 'row', // Ensure horizontal layout
    justifyContent: 'flex-start', // Align items to the start
    marginLeft: 20,
  },
  photoCard: {
    marginBottom: 16,
    alignItems: 'center',
    marginRight: 16, // Add some space between the images
    width: width * 0.4, // Make image responsive based on screen width
  },
  photoImage: {
    width: '100%', // Make image fill the available space within the photoCard
    height: 150, // Fixed height for the image
    borderRadius: 25, // Round the image
  },
  photoName: {
    marginTop: 10,
    fontWeight: '600',
    color: '#333',
    fontSize: 14, // Adjust font size to fit better
    textAlign: 'center',
    maxWidth: width * 0.4, // Ensure the name doesn't overflow
    overflow: 'hidden', // Hide overflow text if it goes beyond the max width
    textAlign: 'center', // Center the text
  },
  linksContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginRight: 12,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InfoScreen;
