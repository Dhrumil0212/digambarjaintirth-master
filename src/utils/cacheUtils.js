import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to fetch data with caching
export const fetchWithCache = async (key, fetchFunction) => {
  const now = new Date().getTime();
  const cacheKey = `${key}_cache`;
  const cacheTimestampKey = `${key}_timestamp`;

  try {
    // Check if cached data exists and is less than 24 hours old
    const cachedData = await AsyncStorage.getItem(cacheKey);
    const cachedTimestamp = await AsyncStorage.getItem(cacheTimestampKey);

    if (cachedData && cachedTimestamp) {
      const age = now - parseInt(cachedTimestamp, 10);
      const oneDayInMillis = 24 * 60 * 60 * 1000;

      if (age < oneDayInMillis) {
        // Return cached data if it's still valid
        return JSON.parse(cachedData);
      }
    }

    // Fetch new data if cache is expired or doesn't exist
    const newData = await fetchFunction();

    // Update cache with new data and current timestamp
    await AsyncStorage.setItem(cacheKey, JSON.stringify(newData));
    await AsyncStorage.setItem(cacheTimestampKey, now.toString());

    return newData;
  } catch (error) {
    console.error("Error in fetchWithCache:", error);
    throw error;
  }
};