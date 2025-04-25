import React, { createContext, useContext, useState, useEffect } from 'react';
import { WaterIntake } from '../types';
import { useUser } from './UserContext';
import { formatDate } from '../utils/dateUtils';

interface WaterIntakeContextType {
  todayIntake: WaterIntake;
  historyData: Record<string, WaterIntake>;
  addWaterIntake: (amount: number) => void;
  resetTodayIntake: () => void;
  getTodayPercentage: () => number;
  getWeeklyData: () => Record<string, number>;
  getMonthlyData: () => Record<string, number>;
  goalAchievedToday: boolean;
}

const WaterIntakeContext = createContext<WaterIntakeContextType | undefined>(undefined);

export const WaterIntakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, incrementStreak } = useUser();
  const [todayIntake, setTodayIntake] = useState<WaterIntake>({
    date: formatDate(new Date()),
    amount: 0,
    entries: [],
  });
  
  const [historyData, setHistoryData] = useState<Record<string, WaterIntake>>({});
  const [goalAchievedToday, setGoalAchievedToday] = useState(false);

  // Load history data from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('hydrobuddy_history');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistoryData(parsedHistory);
      
      // Initialize today's intake
      const today = formatDate(new Date());
      if (parsedHistory[today]) {
        setTodayIntake(parsedHistory[today]);
        
        // Check if goal was already achieved today
        if (user && parsedHistory[today].amount >= user.waterGoal) {
          setGoalAchievedToday(true);
        }
      }
    }
  }, [user]);

  // Save history data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hydrobuddy_history', JSON.stringify(historyData));
  }, [historyData]);

  // Check if water goal is achieved when intake or user changes
  useEffect(() => {
    if (user && todayIntake && !goalAchievedToday) {
      if (todayIntake.amount >= user.waterGoal) {
        setGoalAchievedToday(true);
        incrementStreak();
      }
    }
  }, [todayIntake, user, goalAchievedToday, incrementStreak]);

  // Reset daily intake if the date changes
  useEffect(() => {
    const today = formatDate(new Date());
    if (todayIntake.date !== today) {
      setTodayIntake({
        date: today,
        amount: 0,
        entries: [],
      });
      setGoalAchievedToday(false);
    }
  }, [todayIntake.date]);

  const addWaterIntake = (amount: number) => {
    const updatedIntake = {
      ...todayIntake,
      amount: todayIntake.amount + amount,
      entries: [
        ...todayIntake.entries,
        {
          timestamp: Date.now(),
          amount,
        },
      ],
    };
    
    setTodayIntake(updatedIntake);
    
    // Update history data
    setHistoryData({
      ...historyData,
      [todayIntake.date]: updatedIntake,
    });
  };

  const resetTodayIntake = () => {
    const today = formatDate(new Date());
    const newTodayIntake = {
      date: today,
      amount: 0,
      entries: [],
    };
    
    setTodayIntake(newTodayIntake);
    
    // Update history data
    const updatedHistory = { ...historyData };
    updatedHistory[today] = newTodayIntake;
    
    setHistoryData(updatedHistory);
    setGoalAchievedToday(false);
  };

  const getTodayPercentage = (): number => {
    if (!user) return 0;
    const percentage = (todayIntake.amount / user.waterGoal) * 100;
    return Math.min(percentage, 100);
  };

  const getWeeklyData = (): Record<string, number> => {
    const result: Record<string, number> = {};
    const today = new Date();
    
    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = formatDate(date);
      
      result[dateString] = historyData[dateString]?.amount || 0;
    }
    
    return result;
  };

  const getMonthlyData = (): Record<string, number> => {
    const result: Record<string, number> = {};
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get data for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = formatDate(date);
      
      // Only include days up to today
      if (date <= today) {
        result[dateString] = historyData[dateString]?.amount || 0;
      }
    }
    
    return result;
  };

  return (
    <WaterIntakeContext.Provider
      value={{
        todayIntake,
        historyData,
        addWaterIntake,
        resetTodayIntake,
        getTodayPercentage,
        getWeeklyData,
        getMonthlyData,
        goalAchievedToday,
      }}
    >
      {children}
    </WaterIntakeContext.Provider>
  );
};

export const useWaterIntake = (): WaterIntakeContextType => {
  const context = useContext(WaterIntakeContext);
  if (context === undefined) {
    throw new Error('useWaterIntake must be used within a WaterIntakeProvider');
  }
  return context;
};

export default WaterIntakeContext;