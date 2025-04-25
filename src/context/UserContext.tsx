import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Badge } from '../types';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUser: (data: Partial<User>) => void;
  calculateWaterGoal: (weight: number, tempAdjustment?: number) => number;
  addBadge: (badge: Badge) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultBadges: Badge[] = [
  {
    id: 'three-day-streak',
    name: '3-Day Streak',
    description: 'Reached your water goal for 3 consecutive days',
    icon: 'trophy',
    unlocked: false,
  },
  {
    id: 'heat-master',
    name: 'Heat Master',
    description: 'Met your water goal on a hot day',
    icon: 'flame',
    unlocked: false,
  },
  {
    id: 'hydration-streaker',
    name: 'Hydration Streaker',
    description: 'Reached your water goal for 7 consecutive days',
    icon: 'medal',
    unlocked: false,
  },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('hydrobuddy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('hydrobuddy_user', JSON.stringify(user));
    }
  }, [user]);

  const calculateWaterGoal = (weight: number, tempAdjustment = 0): number => {
    // Base calculation: weight * 35ml + any temperature adjustments
    const baseGoal = weight * 35;
    return Math.round(baseGoal * (1 + tempAdjustment));
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const addBadge = (badge: Badge) => {
    if (user) {
      const updatedBadges = [...user.badges];
      const badgeIndex = updatedBadges.findIndex(b => b.id === badge.id);
      
      if (badgeIndex !== -1) {
        updatedBadges[badgeIndex] = {
          ...updatedBadges[badgeIndex],
          unlocked: true,
          unlockedAt: Date.now(),
        };
        
        setUser({
          ...user,
          badges: updatedBadges,
        });
      }
    }
  };

  const incrementStreak = () => {
    if (user) {
      const newStreak = user.streak + 1;
      setUser({
        ...user,
        streak: newStreak,
      });
      
      // Check for streak badges
      if (newStreak === 3) {
        addBadge(user.badges.find(b => b.id === 'three-day-streak') as Badge);
      } else if (newStreak === 7) {
        addBadge(user.badges.find(b => b.id === 'hydration-streaker') as Badge);
      }
    }
  };

  const resetStreak = () => {
    if (user) {
      setUser({
        ...user,
        streak: 0,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        calculateWaterGoal,
        addBadge,
        incrementStreak,
        resetStreak,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;