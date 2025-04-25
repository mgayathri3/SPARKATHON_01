import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Thermometer, Droplet, CloudRain } from 'lucide-react';

const WeatherWidget: React.FC = () => {
  const { weather, getWeatherMessage } = useWeather();
  
  if (weather.loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (weather.error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-red-500">Weather data unavailable</p>
      </div>
    );
  }
  
  const weatherMessage = getWeatherMessage();
  
  // Determine background gradient based on temperature
  let bgGradient = 'from-blue-50 to-blue-100';
  if (weather.temp >= 30) {
    bgGradient = 'from-orange-50 to-orange-100';
  } else if (weather.temp >= 25) {
    bgGradient = 'from-yellow-50 to-yellow-100';
  } else if (weather.temp <= 10) {
    bgGradient = 'from-sky-50 to-sky-100';
  }
  
  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-lg p-4 shadow-sm transition-colors duration-500`}>
      <h3 className="text-gray-700 font-medium mb-2">Today's Weather</h3>
      
      <div className="flex items-center mb-2">
        <Thermometer size={20} className="text-red-500 mr-2" />
        <span className="text-gray-800 font-semibold">{weather.temp}°C</span>
      </div>
      
      <div className="flex items-center mb-3">
        <Droplet size={20} className="text-blue-500 mr-2" />
        <span className="text-gray-800">{weather.humidity}% humidity</span>
      </div>
      
      {weatherMessage && (
        <div className="bg-white bg-opacity-70 p-2 rounded-md text-sm text-blue-800 flex items-start mt-2">
          <CloudRain size={16} className="mr-1 mt-0.5 flex-shrink-0" />
          <p>{weatherMessage}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;