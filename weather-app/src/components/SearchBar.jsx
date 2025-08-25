import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city) return;
    onSearch(city);
    setCity('');
  };

  return (
    <form onSubmit={handleSubmit} className="search">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Search city"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
