import React from 'react';
import HistoryChart from '../components/HistoryChart';
import { useUser } from '../context/UserContext';

const History: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Your Hydration History
      </h1>
      
      <div className="mb-6">
        <HistoryChart />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Hydration Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="font-medium">Streak</p>
            <p className="text-2xl font-bold text-blue-600">{user.streak} days</p>
            <p className="text-sm text-gray-600">Current streak of meeting your water goal</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="font-medium">Achievements</p>
            <p className="text-2xl font-bold text-blue-600">
              {user.badges.filter(b => b.unlocked).length}/{user.badges.length}
            </p>
            <p className="text-sm text-gray-600">Badges earned for your hydration habits</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="font-medium">Daily Goal</p>
            <p className="text-2xl font-bold text-blue-600">{user.waterGoal}ml</p>
            <p className="text-sm text-gray-600">Your personalized water intake target</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;