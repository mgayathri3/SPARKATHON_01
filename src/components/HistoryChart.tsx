import React, { useState } from 'react';
import { useWaterIntake } from '../context/WaterIntakeContext';
import { useUser } from '../context/UserContext';
import { formatDisplayDate, getDayName } from '../utils/dateUtils';

type ViewType = 'week' | 'month';

const HistoryChart: React.FC = () => {
  const { getWeeklyData, getMonthlyData } = useWaterIntake();
  const { user } = useUser();
  const [view, setView] = useState<ViewType>('week');
  
  if (!user) return null;
  
  const data = view === 'week' ? getWeeklyData() : getMonthlyData();
  const waterGoal = user.waterGoal;
  
  // Find the maximum value for scaling
  const maxValue = Math.max(...Object.values(data), waterGoal);
  
  // Calculate bar height percentages
  const getBarHeight = (value: number): number => {
    return (value / maxValue) * 100;
  };
  
  // Get color based on goal achievement
  const getBarColor = (value: number): string => {
    if (value === 0) return 'bg-gray-200';
    return value >= waterGoal ? 'bg-green-500' : 'bg-blue-400';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Water Intake History</h2>
        
        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm transition-colors ${
              view === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm transition-colors ${
              view === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div 
          className="flex items-end space-x-2" 
          style={{ 
            minWidth: view === 'week' ? '400px' : '600px',
            height: '200px',
          }}
        >
          {Object.entries(data).map(([date, value]) => (
            <div key={date} className="flex-1 flex flex-col items-center">
              <div className="w-full relative flex-1 flex items-end">
                {/* Water goal line */}
                <div 
                  className="absolute w-full border-t border-dashed border-gray-300 flex justify-end"
                  style={{ 
                    bottom: `${getBarHeight(waterGoal)}%`,
                    minHeight: '1px',
                  }}
                >
                  <span className="text-xs text-gray-500 pr-1">{waterGoal}ml</span>
                </div>
                
                {/* Bar */}
                <div
                  className={`w-full mx-auto rounded-t-md transition-all duration-500 ${getBarColor(value)}`}
                  style={{
                    height: `${getBarHeight(value)}%`,
                    minHeight: value > 0 ? '4px' : '0px',
                    maxWidth: '30px',
                  }}
                ></div>
              </div>
              
              <div className="mt-2 text-center">
                <div className="text-xs font-medium">
                  {value > 0 && `${value}ml`}
                </div>
                <div className="text-xs text-gray-500">
                  {view === 'week' ? getDayName(date) : formatDisplayDate(date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;