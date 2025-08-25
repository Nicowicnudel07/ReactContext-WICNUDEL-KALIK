import { useEffect, useState, useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext.jsx';
import { UnitContext } from '../context/UnitContext.jsx';

const CitySummary = ({ city, onSelect }) => {
  const { fetchSummary } = useContext(WeatherContext);
  const { unit } = useContext(UnitContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSummary(city, unit === 'celsius' ? 'metric' : 'imperial')
      .then(setData)
      .catch(console.error);
  }, [city, unit, fetchSummary]);

  if (!data) return null;

  return (
    <div className="city-summary" onClick={() => onSelect(city)} role="button">
      <h4>{data.name}</h4>
      <p>{Math.round(data.main.temp)}°</p>
    </div>
  );
};

export default CitySummary;
