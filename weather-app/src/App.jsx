import { useState, useContext } from 'react';
import { ThemeContext } from './context/ThemeContext.jsx';
import { UnitContext } from './context/UnitContext.jsx';
import { WeatherContext } from './context/WeatherContext.jsx';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { unit, toggleUnit } = useContext(UnitContext);
  const { weatherData, fetchWeather } = useContext(WeatherContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) return;
    try {
      await fetchWeather(city, unit === 'celsius' ? 'metric' : 'imperial');
    } catch (err) {
      console.error(err);
      alert('City not found');
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Weather App</h1>
        <div className="actions">
          <button onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'} Mode</button>
          <button onClick={toggleUnit}>{unit === 'celsius' ? '\u00B0F' : '\u00B0C'}</button>
        </div>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <button type="submit">Search</button>
        </form>

        {weatherData && weatherData.main && (
          <div className="weather">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="temp">
              {Math.round(weatherData.main.temp)}° {unit === 'celsius' ? 'C' : 'F'}
            </p>
            <p className="description">{weatherData.weather[0].description}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
