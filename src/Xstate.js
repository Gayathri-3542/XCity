import React, { useState, useEffect } from "react";
import styles from "./Xstate";

const Xstate = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch countries
  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
      )
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
          setSelectedState(""); // Reset state selection
          setCities([]); // Clear cities
          setSelectedCity(""); // Reset city selection
        })
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [selectedCountry]);

  // Fetch cities when state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
      )
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
          setSelectedCity(""); // Reset city selection
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className={styles["city-selector"]}>
      <h1>Select Location</h1>
      <div className={styles.dropdowns}>
        {/* Country Dropdown */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Result */}
      {selectedCity && (
        <h2 className={styles.result}>
          You selected <span className={styles.highlight}>{selectedCity}</span>,
          <span className={styles.fade}>
            {" "}
            {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
    </div>
  );
};

export default Xstate;

