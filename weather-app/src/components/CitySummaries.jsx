import CitySummary from './CitySummary.jsx';

const cities = ['New York', 'Copenhagen', 'Tokyo'];

const CitySummaries = ({ onSelect }) => (
  <section className="cities">
    {cities.map((city) => (
      <CitySummary key={city} city={city} onSelect={onSelect} />
    ))}
  </section>
);

export default CitySummaries;
