import React, { createContext, useContext, useState, useEffect } from 'react';
import { Weather } from '../types';
import { useUser } from './UserContext';

interface WeatherContextType {
  weather: Weather;
  getAdjustmentFactor: () => number;
  getWeatherMessage: () => string | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const WEATHER_API_KEY = '9723425ee0c435b8bbb85527e7ac5108'; // Use your actual API key
const CITY = 'Chennai';

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useUser();
  const [weather, setWeather] = useState<Weather>({
    temp: 0,
    humidity: 0,
    description: '',
    icon: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      const lastFetchTime = localStorage.getItem('hydrobuddy_weather_fetch');
      const now = Date.now();

      if (lastFetchTime && now - Number(lastFetchTime) < 3600000) {
        const cachedWeather = localStorage.getItem('hydrobuddy_weather');
        if (cachedWeather) {
          setWeather(JSON.parse(cachedWeather));
          return;
        }
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        const fetchedWeather: Weather = {
          temp: data.main.temp,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false,
          error: null,
        };

        setWeather(fetchedWeather);
        localStorage.setItem('hydrobuddy_weather', JSON.stringify(fetchedWeather));
        localStorage.setItem('hydrobuddy_weather_fetch', String(now));

        if (user) {
          const adjustmentFactor = getAdjustmentFactor(fetchedWeather);
          const newGoal = user.waterGoal * (1 + adjustmentFactor);

          if (Math.abs(newGoal - user.waterGoal) > 50) {
            updateUser({ waterGoal: Math.round(newGoal) });
          }
        }
      } catch (error) {
        setWeather((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch weather data',
        }));
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 3600000);
    return () => clearInterval(interval);
  }, [user, updateUser]);

  const getAdjustmentFactor = (weatherData = weather): number => {
    let adjustment = 0;

    if (weatherData.temp >= 30) adjustment += 0.1;
    else if (weatherData.temp >= 25) adjustment += 0.05;
    if (weatherData.humidity >= 70) adjustment += 0.05;

    return adjustment;
  };

  const getWeatherMessage = (): string | null => {
    if (weather.loading || weather.error) return null;

    if (weather.temp >= 30) return "It's hot! Stay extra hydrated 💦";
    if (weather.temp >= 25) return "It's warm today. Remember to drink more water 💧";
    if (weather.humidity >= 70) return "High humidity today. Keep your water bottle handy 💦";

    return null;
  };

  return (
    <WeatherContext.Provider value={{ weather, getAdjustmentFactor, getWeatherMessage }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default WeatherContext;
