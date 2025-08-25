/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [lastCity, setLastCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async (city, units) => {
    if (city === lastCity && weatherData) return weatherData;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&units=${units}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    setLastCity(city);
    setWeatherData(data);
    return data;
  };

  return (
    <WeatherContext.Provider value={{ weatherData, fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};
