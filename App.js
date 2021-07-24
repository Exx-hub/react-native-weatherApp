import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import WeatherInfo from "./components/WeatherInfo";

const WEATHER_API_KEY = "facfbf6d0936b8007bcd0ee4591920a4";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    try {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMessage("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;

        const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`;

        const response = await fetch(weatherUrl);
        const result = await response.json();

        if (response.ok) {
          setCurrentWeather(result);
          console.log(result);
        } else {
          setErrorMessage(result.message);
        }
      })();
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.main}>
        {currentWeather ? (
          <WeatherInfo currentWeather={currentWeather} />
        ) : (
          <Text>LOADING...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    // alignItems: "center",
    justifyContent: "center",
  },
  main: {
    justifyContent: "center",
    // alignItems: "center",
    flex: 1,
  },
});
