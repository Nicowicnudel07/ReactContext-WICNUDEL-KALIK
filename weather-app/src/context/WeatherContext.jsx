/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [lastCity, setLastCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);

  const fetchWeather = async (city, units) => {
    try {
      // Obtener clima actual
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&units=${units}`;
      const currentRes = await fetch(currentUrl);
      if (!currentRes.ok) throw new Error('City not found');
      const currentData = await currentRes.json();
      
      // Obtener pronóstico de 5 días
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&units=${units}`;
      const forecastRes = await fetch(forecastUrl);
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        
        // Procesar pronóstico por horas (próximas 24 horas)
        const hourly = forecastData.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].main),
          temp: Math.round(item.main.temp)
        }));
        
        // Procesar pronóstico de 5 días
        const daily = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5).map((item, index) => ({
          day: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].main),
          temp: Math.round(item.main.temp),
          progress: Math.random() * 60 + 30 // Valor aleatorio para la barra de progreso
        }));
        
        setHourlyForecast(hourly);
        setFiveDayForecast(daily);
      }
      
      setLastCity(city);
      setWeatherData(currentData);
      return currentData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'snow': '❄️',
      'rain': '🌧️',
      'drizzle': '🌧️',
      'thunderstorm': '⛈️',
      'clouds': '☁️',
      'clear': '☀️',
      'mist': '🌫️',
      'fog': '🌫️',
      'haze': '🌫️'
    };
    return iconMap[condition.toLowerCase()] || '🌤️';
  };

  return (
    <WeatherContext.Provider value={{ 
      weatherData, 
      fetchWeather, 
      hourlyForecast, 
      fiveDayForecast
    }}>
      {children}
    </WeatherContext.Provider>
  );
};
