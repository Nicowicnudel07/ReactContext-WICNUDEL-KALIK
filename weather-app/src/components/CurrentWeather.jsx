import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext.jsx';
import { UnitContext } from '../context/UnitContext.jsx';

const formatTime = (dt, timezone) => {
  const date = new Date((dt + timezone) * 1000);
  return date.toUTCString().replace(' GMT', '');
};

const CurrentWeather = () => {
  const { weatherData } = useContext(WeatherContext);
  const { unit } = useContext(UnitContext);

  if (!weatherData) return null;

  return (
    <section className="current-weather">
      <h2>
        {weatherData.name}, {weatherData.sys.country}
      </h2>
      <p className="time">{formatTime(weatherData.dt, weatherData.timezone)}</p>
      <div className="temp">
        {Math.round(weatherData.main.temp)}° {unit === 'celsius' ? 'C' : 'F'}
      </div>
      <p className="status">{weatherData.weather[0].description}</p>
      <p>
        Wind: {Math.round(weatherData.wind.speed)} {unit === 'celsius' ? 'm/s' : 'mph'}
      </p>
      <p>
        High: {Math.round(weatherData.main.temp_max)}° / Low: {Math.round(weatherData.main.temp_min)}°
      </p>
    </section>
  );
};

export default CurrentWeather;
