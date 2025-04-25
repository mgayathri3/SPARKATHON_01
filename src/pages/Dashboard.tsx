import React from 'react';
import WaterProgressCircle from '../components/WaterProgressCircle';
import WaterIntakeButtons from '../components/WaterIntakeButtons';
import WeatherWidget from '../components/WeatherWidget';
import StreakTracker from '../components/StreakTracker';
import BadgeDisplay from '../components/BadgeDisplay';
import NotificationSettings from '../components/NotificationSettings';
import { useUser } from '../context/UserContext';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  
  return (
    <div className="container mx-auto px-4 py-6">
      {user && (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Hey {user.name}, let's stay hydrated today!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 flex justify-center mb-6 md:mb-0">
                    <WaterProgressCircle />
                  </div>
                  
                  <div className="flex-1">
                    <WaterIntakeButtons />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StreakTracker />
                <BadgeDisplay />
              </div>
            </div>
            
            <div className="space-y-6">
              <WeatherWidget />
              <NotificationSettings />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;