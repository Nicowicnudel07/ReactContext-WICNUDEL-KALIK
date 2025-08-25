/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [lastCity, setLastCity] = useState('');
  const [lastUnits, setLastUnits] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [summaries, setSummaries] = useState({});

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  const fetchWeather = async (city, units) => {
    if (
      city === lastCity &&
      units === lastUnits &&
      weatherData &&
      forecastData
    ) {
      return;
    }

    const params = `q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    const [wRes, fRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`),
    ]);
    if (!wRes.ok || !fRes.ok) throw new Error('City not found');
    const weather = await wRes.json();
    const forecast = await fRes.json();
    setLastCity(city);
    setLastUnits(units);
    setWeatherData(weather);
    setForecastData(forecast);
  };

  const fetchSummary = async (city, units) => {
    const key = `${city}-${units}`;
    if (summaries[key]) return summaries[key];
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    setSummaries((prev) => ({ ...prev, [key]: data }));
    return data;
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        forecastData,
        fetchWeather,
        fetchSummary,
        lastCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
