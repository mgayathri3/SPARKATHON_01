import React from 'react';
import { useUser } from '../context/UserContext';
import { Flame } from 'lucide-react';

const StreakTracker: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 shadow-sm">
      <h3 className="text-gray-700 font-medium mb-2">Current Streak</h3>
      
      <div className="flex items-center">
        <div className="relative">
          <Flame 
            size={28} 
            className={`text-orange-500 ${user.streak > 0 ? 'animate-flicker' : ''}`} 
          />
          {user.streak >= 3 && (
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
              {user.streak}
            </div>
          )}
        </div>
        
        <div className="ml-3">
          <p className="font-semibold">
            {user.streak === 0 ? (
              "Start your streak today!"
            ) : (
              <>
                {user.streak} day{user.streak !== 1 ? 's' : ''} streak! 
                {user.streak >= 3 && " 🔥"}
              </>
            )}
          </p>
          
          <p className="text-sm text-gray-600">
            {user.streak === 0 ? (
              "Meet your water goal today"
            ) : (
              "Keep the streak going!"
            )}
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-flicker {
          animation: flicker 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default StreakTracker;