import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './context/ThemeContext.jsx';
import { UnitContext } from './context/UnitContext.jsx';
import { WeatherContext } from './context/WeatherContext.jsx';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { unit, toggleUnit } = useContext(UnitContext);
  const { weatherData, fetchWeather, fetchWeatherByCoords, hourlyForecast, fiveDayForecast } = useContext(WeatherContext);

  // Datos de ejemplo para otras ciudades (estos se mantienen como ejemplo)
  const otherCities = [
    { country: 'US', city: 'New York', condition: 'Clear sky', icon: '☀️', temp: 14 },
    { country: 'Denmark', city: 'Copenhagen', condition: 'Snow', icon: '❄️', temp: 0 },
    { country: 'Vietnam', city: 'Ho Chi Minh City', condition: 'Thunderstorm', icon: '⛈️', temp: 28 }
  ];

  const handleCityClick = async (cityName) => {
    try {
      await fetchWeather(cityName, unit === 'celsius' ? 'metric' : 'imperial');
      setCity(cityName);
    } catch (err) {
      console.error('Error loading city:', err);
      alert(err.message || 'City not found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchCity) return;
    try {
      await fetchWeather(searchCity, unit === 'celsius' ? 'metric' : 'imperial');
      setCity(searchCity);
      setSearchCity('');
    } catch (err) {
      console.error(err);
      alert(err.message || 'City not found');
    }
  };

  const handleUnitToggle = async () => {
    toggleUnit();
    // Si hay una ciudad cargada, actualizar con las nuevas unidades
    if (city && weatherData) {
      const newUnit = unit === 'celsius' ? 'imperial' : 'celsius';
      try {
        await fetchWeather(city, newUnit === 'celsius' ? 'metric' : 'imperial');
      } catch (err) {
        console.error('Error updating units:', err);
      }
    }
  };

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no está soportada en tu navegador');
      return;
    }

    try {
      // Mostrar indicador de carga
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Obtener el clima usando coordenadas
      await fetchWeatherByCoords(latitude, longitude, unit === 'celsius' ? 'metric' : 'imperial');
      setCity('Mi ubicación');
    } catch (err) {
      console.error('Error getting location:', err);
      if (err.code === 1) {
        alert('Permiso denegado para acceder a la ubicación');
      } else if (err.code === 2) {
        alert('Ubicación no disponible');
      } else if (err.code === 3) {
        alert('Tiempo de espera agotado para obtener la ubicación');
      } else {
        alert('Error al obtener tu ubicación');
      }
    }
  };

  // Cargar Helsinki por defecto solo la primera vez
  useEffect(() => {
    const loadDefaultCity = async () => {
      try {
        await fetchWeather('Helsinki', unit === 'celsius' ? 'metric' : 'imperial');
        setCity('Helsinki');
      } catch (err) {
        console.error('Error loading default city:', err);
      }
    };
    
    // Solo cargar Helsinki si no hay datos de clima cargados
    if (!weatherData) {
      loadDefaultCity();
    }
  }, []); // Solo se ejecuta una vez al montar el componente



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

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`app ${theme}`}>
      {/* Header con búsqueda y controles */}
      <header className="header">
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search city..."
                className="search-input"
              />
            </form>
          </div>
        </div>
        
        <div className="header-controls">
          <button onClick={handleLocationClick} className="location-toggle" title="Mi ubicación actual">
            📍
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={handleUnitToggle} className="unit-toggle">
            {unit === 'celsius' ? '°F' : '°C'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Sección superior: Clima principal y pronóstico por horas */}
        <div className="top-section">
          {/* Tarjeta principal del clima */}
          {weatherData && weatherData.main && (
            <div className="main-weather-card">
              <div className="main-weather-left">
                <div className="main-temperature">
                  {Math.round(weatherData.main.temp)}°
                </div>
                <div className="weather-condition">
                  {getWeatherIcon(weatherData.weather[0].main)}
                  <span>{weatherData.weather[0].main}</span>
                </div>
                <div className="feels-like">
                  Feel like: {Math.round(weatherData.main.feels_like)} °{unit === 'celsius' ? 'C' : 'F'}
                </div>
              </div>
              <div className="main-weather-right">
                <div className="city-info">
                  <div className="city-name">{weatherData.name}</div>
                  <div className="current-time">{formatTime()}</div>
                </div>
                <div className="weather-details">
                  <div className="wind-info">
                    💨 {weatherData.wind?.speed || 0} m/s
                  </div>
                  <div className="temp-range">
                    {Math.round(weatherData.main.temp_min)}° to {Math.round(weatherData.main.temp_max)}°
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pronóstico por horas */}
          <div className="hourly-forecast">
            <div className="hourly-scroll">
              {hourlyForecast.length > 0 ? (
                hourlyForecast.map((hour, index) => (
                  <div key={index} className="hourly-card">
                    <div className="hour-time">{hour.time}</div>
                    <div className="hour-icon">{hour.icon}</div>
                    <div className="hour-condition">{hour.condition}</div>
                    <div className="hour-temp">{hour.temp}°</div>
                  </div>
                ))
              ) : (
                // Datos de ejemplo cuando no hay datos reales
                [
                  { time: '9:00 AM', condition: 'Snow', icon: '❄️', temp: -1 },
                  { time: '12:00 AM', condition: 'Drizzle', icon: '🌧️', temp: 0 },
                  { time: '3:00 PM', condition: 'Clouds', icon: '☁️', temp: 1 },
                  { time: '6:00 PM', condition: 'Clear', icon: '☀️', temp: 3 },
                  { time: '9:00 PM', condition: 'Mist', icon: '🌫️', temp: 2 },
                  { time: '12:00 AM', condition: 'Thunderstorm', icon: '⛈️', temp: 1 },
                  { time: '3:00 AM', condition: 'Rain', icon: '🌧️', temp: 0 }
                ].map((hour, index) => (
                  <div key={index} className="hourly-card">
                    <div className="hour-time">{hour.time}</div>
                    <div className="hour-icon">{hour.icon}</div>
                    <div className="hour-condition">{hour.condition}</div>
                    <div className="hour-temp">{hour.temp}°</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sección inferior: Otras ciudades y pronóstico de 5 días */}
        <div className="bottom-section">
          {/* Otras ciudades grandes */}
          <div className="other-cities">
            <h3 className="section-title">Other large cities</h3>
            <div className="cities-list">
                             {otherCities.map((cityData, index) => (
                 <div 
                   key={index} 
                   className="city-card"
                   onClick={() => handleCityClick(cityData.city)}
                   style={{ cursor: 'pointer' }}
                 >
                   <div className="city-info-left">
                     <div className="city-country">{cityData.country}</div>
                     <div className="city-name">{cityData.city}</div>
                     <div className="city-condition">{cityData.condition}</div>
                   </div>
                   <div className="city-info-right">
                     <div className="city-icon">{cityData.icon}</div>
                     <div className="city-temp">{cityData.temp}°</div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Pronóstico de 5 días */}
          <div className="five-day-forecast">
            <h3 className="section-title">5-day forecast</h3>
            <div className="forecast-list">
              {fiveDayForecast.length > 0 ? (
                fiveDayForecast.map((day, index) => (
                  <div key={index} className="forecast-row">
                    <div className="forecast-day">{day.day}</div>
                    <div className="forecast-weather">
                      <span className="forecast-icon">{day.icon}</span>
                      <span className="forecast-condition">{day.condition}</span>
                    </div>
                    <div className="forecast-temp">{day.temp}°</div>
                    <div className="forecast-bar">
                      <div 
                        className="forecast-progress" 
                        style={{ width: `${day.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                // Datos de ejemplo cuando no hay datos reales
                [
                  { day: 'Today', condition: 'Clouds', icon: '☁️', temp: -1, progress: 60 },
                  { day: 'Fri', condition: 'Snow', icon: '❄️', temp: -2, progress: 40 },
                  { day: 'Sat', condition: 'Clear', icon: '☀️', temp: -3, progress: 80 },
                  { day: 'Sun', condition: 'Thunderstorm', icon: '⛈️', temp: 4, progress: 30 },
                  { day: 'Mon', condition: 'Clear', icon: '☀️', temp: 7, progress: 90 }
                ].map((day, index) => (
                  <div key={index} className="forecast-row">
                    <div className="forecast-day">{day.day}</div>
                    <div className="forecast-weather">
                      <span className="forecast-icon">{day.icon}</span>
                      <span className="forecast-condition">{day.condition}</span>
                    </div>
                    <div className="forecast-temp">{day.temp}°</div>
                    <div className="forecast-bar">
                      <div 
                        className="forecast-progress" 
                        style={{ width: `${day.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
