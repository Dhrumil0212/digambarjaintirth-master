import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList } from 'react-native';

// Sample data for photos and details of other developers
const otherDevelopers = [
  { id: '1', name: 'प्रेरणा स्तोत्र : ब्र.अनिल कुमार जैन', image: 'https://picsum.photos/300', details: 'Details about developer 1' },
  { id: '2', name: 'मार्गदर्शन: पूज्य मुनि श्री अभय सागर जी महाराज', image: 'https://picsum.photos/300', details: 'Details about developer 2' },
];

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
          {/* <Text style={styles.developerDetails}>Senior Developer at XYZ Company. Passionate about creating awesome apps!</Text> */}
        </View>
      </View>

      {/* Grid of Other Developers */}
      {/* <Text style={styles.subHeader}>Other Developers</Text> */}
      <FlatList
        data={otherDevelopers}
        renderItem={({ item }) => (
          <View style={styles.photoCard}>
            <Image source={{ uri: item.image }} style={styles.photoImage} />
            <Text style={styles.photoName}>{item.name}</Text>
            <Text style={styles.photoDetails}>{item.details}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.photoGrid}
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
  subHeader: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  contactInfoContainer: {
    flexDirection: 'row', // Side-by-side layout
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
  developerDetails: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    marginTop: 8,
  },
  photoGrid: {
    marginBottom: 20,
  },
  photoCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  photoImage: {
    width: 150,  // Larger image for other developers
    height: 150, // Larger image for other developers
    borderRadius: 75,  // Round image
  },
  photoName: {
    marginTop: 10,
    fontWeight: '600',
    color: '#333',
    fontSize: 18,
  },
  photoDetails: {
    marginTop: 8,
    color: '#555',
    textAlign: 'center',
    fontSize: 14,
  },
  linksContainer: {
    marginTop: 20,
    flexDirection: 'row',  // Horizontal arrangement
    justifyContent: 'space-between',  // Space buttons apart
    alignItems: 'center',
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginRight: 12,  // Space between buttons
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InfoScreen;
