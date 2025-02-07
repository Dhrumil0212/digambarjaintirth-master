import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList, Dimensions, ScrollView } from 'react-native';

// Sample data for photos and details of other developers
const otherDevelopers = [
  { id: '3', name: 'आचार्य श्री विद्यासागर जी महाराज', image: 'https://i.imgur.com/qRiNAvr.png' },
  { id: '4', name: 'आशीर्वाद :आचार्य श्री समय सागर जी महाराज', image: 'https://i.imgur.com/l46EH2N.jpeg' },
  { id: '1', name: 'मार्गदर्शन: निर्यापक श्रमण मुनि श्री अभय सागर जी महाराज', image: 'https://vidyasagarmedia.s3.us-east-2.amazonaws.com/monthly_2023_02/large.(12).JPG.e9b47927b0e219572d0876f9d7980f0b.JPG' },
  { id: '2', name: 'प्रेरणा स्रोत : ब्र.अनिल कुमार जैन', image: 'https://i.imgur.com/myI1zBY.jpeg' },
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Developer's Contact Info */}
        <Text style={styles.header}>Contact Information</Text>
        
        {/* Vertical Column of the First Two Images (Centered) */}
        <View style={styles.verticalGrid}>
          {otherDevelopers.slice(0, 1).map((item) => (
            <View key={item.id} style={styles.photoCard}>
              <Image source={{ uri: item.image }} style={styles.photoImage} />
              <Text style={styles.photoName}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* Text "Namostu" after the first image */}
        <Text style={styles.namostuText}>आचार्य श्री विद्यासागर जी महाराज के प्रथम समाधि दिवस के पावन प्रसंग पर</Text>

        {/* Display the second image in vertical layout */}
        <View style={styles.verticalGrid}>
          {otherDevelopers.slice(1, 2).map((item) => (
            <View key={item.id} style={styles.photoCard}>
              <Image source={{ uri: item.image }} style={styles.photoImage} />
              <Text style={styles.photoName}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* Horizontal Grid (Next two images in horizontal layout, Centered) */}
        <FlatList
          data={otherDevelopers.slice(2)} // Use the remaining items for the horizontal layout
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
<View style={styles.contactInfoContainer}>
          <View style={styles.contactTextContainer}>
            <Text style={styles.developerName}>निर्माता: ध्रुमिल जैन</Text>
            <Text style={styles.developerEmail}>Email: dhrumil0212@gmail.com</Text>
          </View>
        </View>

        {/* Additional Text after the horizontal grid */}
        <Text style={styles.additionalText}>
          ब्र अनिल कुमार जैन : अधिष्ठाता एवं ट्रस्टी श्री दिगम्बर जैन उदासीन आश्रम इन्दौर। मोबाइल - 9770872087
        </Text>
      </ScrollView>

      {/* Fixed Position for the Google Form Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => handleOpenLink('https://forms.gle/7WRtpuU8BCRfybPC7')} style={styles.linkButton}>
          <Text style={styles.linkText}>तीर्थ स्थल विवरण फॉर्म</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => handleOpenLink('https://forms.gle/yourGoogleFormLink2')} style={styles.linkButton}>
          <Text style={styles.linkText}>Fill out Form 2</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Add bottom padding to ensure the last content isn't hidden behind the form
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
    
    marginTop: 20,
    alignItems: 'center',
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  developerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  developerEmail: {
    fontSize: 16,
    color: '#555',
    marginTop: 3,
  },
  verticalGrid: {
    flexDirection: 'column', // Vertical layout for the images
    alignItems: 'center',     // Center images horizontally
    // marginBottom: 20, // Add space between images and text
  },
  photoGrid: {
    flexDirection: 'row', // Horizontal layout for the next images
    justifyContent: 'center', // Center the images horizontally
    marginLeft: 20,
    marginTop:11
  },
  photoCard: {
    marginBottom: 4,
    alignItems: 'center',
    marginRight: 16, // Add some space between the images
    width: width * 0.4, // Make image responsive based on screen width
  },
  photoImage: {
    width: '100%', // Make image fill the available space within the photoCard
    height: 150, // Fixed height for the image
    borderRadius: 25, // Round the image
    objectFit: 'contain',
  },
  photoName: {
    marginTop: 7,
    fontWeight: '600',
    color: '#333',
    fontSize: 14, // Adjust font size to fit better
    textAlign: 'center',
    maxWidth: width * 0.4, // Ensure the name doesn't overflow
    overflow: 'hidden', // Hide overflow text if it goes beyond the max width
  },
  namostuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    // marginVertical: 8,
    marginBottom:20
  },
  additionalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight:"600",
     marginTop: 30
  },
  linksContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
