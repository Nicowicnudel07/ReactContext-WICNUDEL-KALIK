/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

export const UnitContext = createContext();

export const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'celsius');

  useEffect(() => {
    localStorage.setItem('unit', unit);
  }, [unit]);

  const toggleUnit = () => setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};
