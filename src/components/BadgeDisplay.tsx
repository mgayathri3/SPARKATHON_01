import React from 'react';
import { useUser } from '../context/UserContext';
import { Trophy, Medal, Flame } from 'lucide-react';

const BadgeDisplay: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const getIconForBadge = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy size={24} className="text-amber-500" />;
      case 'medal':
        return <Medal size={24} className="text-blue-500" />;
      case 'flame':
        return <Flame size={24} className="text-orange-500" />;
      default:
        return <Trophy size={24} className="text-amber-500" />;
    }
  };
  
  // Find the most recently unlocked badge
  const latestBadge = [...user.badges]
    .filter(badge => badge.unlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return b.unlockedAt - a.unlockedAt;
    })[0];
  
  const unlockedCount = user.badges.filter(badge => badge.unlocked).length;
  const totalBadges = user.badges.length;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-medium">Achievements</h3>
        <span className="text-sm text-gray-500">{unlockedCount}/{totalBadges}</span>
      </div>
      
      {latestBadge ? (
        <div className="flex items-center p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-md">
          <div className="bg-white p-2 rounded-full mr-3">
            {getIconForBadge(latestBadge.icon)}
          </div>
          
          <div>
            <p className="font-medium text-amber-800">{latestBadge.name}</p>
            <p className="text-xs text-gray-600">{latestBadge.description}</p>
          </div>
        </div>
      ) : (
        <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">
          Complete your water goals to earn badges!
        </div>
      )}
      
      {unlockedCount > 0 && unlockedCount < totalBadges && (
        <div className="mt-2">
          <p className="text-xs text-blue-600 cursor-pointer hover:underline">
            View all badges
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;