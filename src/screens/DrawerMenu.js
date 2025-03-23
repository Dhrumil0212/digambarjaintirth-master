// src/components/CustomDrawer.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DrawerMenu = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  if (!isVisible) return null;

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity onPress={onClose} style={styles.overlay} />
      <View style={styles.drawerContent}>
        {/* Only the Calendar navigation item */}
        <TouchableOpacity onPress={() => navigation.navigate('CalendarScreen')}>
          <Text style={styles.drawerItem}>Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawerContent: {
    width: 250,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: 50,
    paddingLeft: 20,
  },
  drawerItem: {
    fontSize: 18,
    paddingVertical: 15,
  },
});

export default DrawerMenu;
