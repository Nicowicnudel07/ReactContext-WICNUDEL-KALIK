# Weather App

Aplicación de pronóstico del clima construida con React y Vite.

## Características
- Pronóstico actual de la ciudad seleccionada (por defecto Buenos Aires).
- Detalles de temperatura, ubicación, hora local, viento, máximas/mínimas y estado del tiempo.
- Pronóstico para las próximas 24 horas en intervalos de 3 horas.
- Pronóstico extendido de 5 días.
- Resumen del clima de ciudades como New York, Copenhagen y Tokyo.
- Búsqueda de ciudades.
- Cambio de unidades Celsius/Fahrenheit y tema claro/oscuro usando React Context.
- Guarda el último clima consultado para evitar fetches innecesarios.

## Requisitos
- Node.js 20.19 o superior (o 22.12+) para ejecutar el servidor de desarrollo.

## Configuración
1. Copiar `.env.example` a `.env` dentro de `weather-app` y completar la API key de OpenWeather.
2. Instalar dependencias: `npm install` dentro de `weather-app`.
3. Ejecutar la app: `npm run dev`.

La aplicación estará disponible en `http://localhost:5173`.
