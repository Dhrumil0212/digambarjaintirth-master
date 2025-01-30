// Function to fetch data from Google Sheets
const fetchDataFromGoogleSheets = async () => {
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
      return [];
    }

    return data.values;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return [];
  }
};

// Updated getStates function to fetch data from Google Sheets
export const getStates = async () => {
  const data = await fetchDataFromGoogleSheets();
  const headerRow = data[0];
  const stateColumnIndex = headerRow.indexOf('State');
  const placeColumnIndex = headerRow.indexOf('Name teerth');

  if (stateColumnIndex === -1 || placeColumnIndex === -1) {
    console.error("Required columns not found in the sheet.");
    return [];
  }

  const states = data.slice(1).reduce((acc, row) => {
    const state = row[stateColumnIndex];
    const place = row[placeColumnIndex];

    if (!state || !place) return acc;

    const existingState = acc.find((s) => s.name === state);
    if (existingState) {
      existingState.places.push(place);
    } else {
      acc.push({
        name: state,
        places: [place],
      });
    }
    return acc;
  }, []);

  return states;
};

// Updated getPlacesByState function to fetch data from Google Sheets
export const getPlacesByState = async (stateName) => {
  const data = await fetchDataFromGoogleSheets();
  const headerRow = data[0];
  const stateColumnIndex = headerRow.indexOf('State');
  const placeColumnIndex = headerRow.indexOf('Name teerth');

  if (stateColumnIndex === -1 || placeColumnIndex === -1) {
    console.error("Required columns not found in the sheet.");
    return [];
  }

  const places = data.slice(1)
    .filter((row) => row[stateColumnIndex] === stateName)
    .map((row) => row[placeColumnIndex]);

  return places;
};

// Updated getPlaceByName function to fetch data from Google Sheets
export const getPlaceByName = async (placeName) => {
  const data = await fetchDataFromGoogleSheets();
  const headerRow = data[0];
  const placeColumnIndex = headerRow.indexOf('Name teerth');

  if (placeColumnIndex === -1) {
    console.error("Required column not found in the sheet.");
    return null;
  }

  const place = data.slice(1).find((row) => row[placeColumnIndex] === placeName);
  return place || null;
};