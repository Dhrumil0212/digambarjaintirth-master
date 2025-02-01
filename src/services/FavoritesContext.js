import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../services/LanguageContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { language } = useLanguage();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesKey = language === "en" ? "favorites_en" : "favorites_hi";
        const storedFavorites = await AsyncStorage.getItem(favoritesKey);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };
    loadFavorites();
  }, [language]);

  const toggleFavorite = async (placeName) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(placeName)
        ? prevFavorites.filter((name) => name !== placeName)
        : [...prevFavorites, placeName];

      const favoritesKey = language === "en" ? "favorites_en" : "favorites_hi";
      AsyncStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
