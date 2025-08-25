import { useContext, useEffect } from 'react';
import { ThemeContext } from './context/ThemeContext.jsx';
import { UnitContext } from './context/UnitContext.jsx';
import { WeatherContext } from './context/WeatherContext.jsx';
import SearchBar from './components/SearchBar.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import DailyForecast from './components/DailyForecast.jsx';
import CitySummaries from './components/CitySummaries.jsx';
import './App.css';

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { unit, toggleUnit } = useContext(UnitContext);
  const { fetchWeather, lastCity } = useContext(WeatherContext);

  const units = unit === 'celsius' ? 'metric' : 'imperial';
  const defaultCity = 'Buenos Aires';

  useEffect(() => {
    const city = lastCity || defaultCity;
    fetchWeather(city, units).catch(console.error);
  }, [unit, lastCity, units, fetchWeather]);

  const handleSearch = (city) =>
    fetchWeather(city, units).catch((err) => {
      console.error(err);
      alert('City not found');
    });

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Weather App</h1>
        <div className="actions">
          <button onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'} Mode</button>
          <button onClick={toggleUnit}>{unit === 'celsius' ? '\u00B0F' : '\u00B0C'}</button>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} />
      <CurrentWeather />
      <HourlyForecast />
      <DailyForecast />
      <CitySummaries onSelect={handleSearch} />
    </div>
  );
}

export default App;
