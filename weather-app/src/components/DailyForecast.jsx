import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext.jsx';
import { UnitContext } from '../context/UnitContext.jsx';

const DailyForecast = () => {
  const { forecastData } = useContext(WeatherContext);
  const { unit } = useContext(UnitContext);

  if (!forecastData) return null;

  const days = {};
  forecastData.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  const entries = Object.entries(days).slice(0, 5);

  return (
    <section className="daily">
      <h3>5 day forecast</h3>
      <div className="daily-grid">
        {entries.map(([date, items]) => {
          const temps = items.map((i) => i.main.temp);
          const min = Math.min(...temps);
          const max = Math.max(...temps);
          const icon = items[Math.floor(items.length / 2)].weather[0].icon;
          const dayName = new Date(date).toLocaleDateString(undefined, { weekday: 'short' });
          return (
            <div key={date} className="day">
              <span>{dayName}</span>
              <img
                src={`https://openweathermap.org/img/wn/${icon}.png`}
                alt=""
              />
              <span>
                {Math.round(max)}° / {Math.round(min)}° {unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DailyForecast;
