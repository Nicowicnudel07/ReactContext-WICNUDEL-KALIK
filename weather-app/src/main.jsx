import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UnitProvider } from './context/UnitContext.jsx'
import { WeatherProvider } from './context/WeatherContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UnitProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </UnitProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
