import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext.jsx';
import { UnitContext } from '../context/UnitContext.jsx';

const HourlyForecast = () => {
  const { forecastData } = useContext(WeatherContext);
  const { unit } = useContext(UnitContext);

  if (!forecastData) return null;

  const items = forecastData.list.slice(0, 8);

  return (
    <section className="hourly">
      <h3>Next 24 hours</h3>
      <div className="hourly-grid">
        {items.map((item) => {
          const dt = new Date(item.dt * 1000);
          const hour = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={item.dt} className="hour">
              <span>{hour}</span>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
              />
              <span>{Math.round(item.main.temp)}° {unit === 'celsius' ? 'C' : 'F'}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
