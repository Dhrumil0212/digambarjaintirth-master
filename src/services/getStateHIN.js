
import finalData from "../data/final.json"; // Importing final.json
// const finalData = require("../data/final.json"); // Importing final.json

// Updated getStates function
export const getStates = () => {
  return Promise.resolve(
    finalData.Sheet1.reduce((acc, item) => {
      const state = item.Rajya; // Extracting the state
      const place = item["Naam"]; // Extracting the place

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
    }, [])
  );
};

// Updated getPlacesByState function
export const getPlacesByState = (stateName) => {
  const state = finalData.Sheet1.filter((item) => item.Rajya === stateName);
  const allPlaces = state.map((item) => item["Naam"]);
  console.log(allPlaces);
  
  return Promise.resolve(allPlaces);
};

// Updated getPlaceByName function
export const getPlaceByName = (placeName) => {
  const place = finalData.Sheet1.find(
    (item) => item["Naam"] === placeName
  );
  if (place) return Promise.resolve(place);
  return Promise.reject(new Error("Place not found"));
};
