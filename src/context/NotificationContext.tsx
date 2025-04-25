import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReminderSettings } from '../types';

interface NotificationContextType {
  reminderSettings: ReminderSettings;
  updateReminderSettings: (data: Partial<ReminderSettings>) => void;
  toggleReminders: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  permissionStatus: NotificationPermission | 'default';
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: false,
  interval: 120, // 2 hours in minutes
  startTime: '08:00',
  endTime: '20:00',
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'default'>('default');
  const [timerId, setTimerId] = useState<number | null>(null);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('hydrobuddy_reminder_settings');
    if (savedSettings) {
      setReminderSettings(JSON.parse(savedSettings));
    }
    
    // Check notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hydrobuddy_reminder_settings', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  // Set up or clear reminder timer based on settings
  useEffect(() => {
    if (reminderSettings.enabled && permissionStatus === 'granted') {
      setupReminderTimer();
    } else {
      clearReminderTimer();
    }
    
    return () => clearReminderTimer();
  }, [reminderSettings, permissionStatus]);

  const clearReminderTimer = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
  };

  const setupReminderTimer = () => {
    clearReminderTimer();
    
    // Convert interval from minutes to milliseconds
    const intervalMs = reminderSettings.interval * 60 * 1000;
    
    const newTimerId = window.setInterval(() => {
      // Check if current time is within the specified range
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime >= reminderSettings.startTime && currentTime <= reminderSettings.endTime) {
        showNotification();
      }
    }, intervalMs);
    
    setTimerId(Number(newTimerId));
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Time to hydrate! 💧', {
        body: 'Take a moment to drink some water.',
        icon: '/src/assets/logo.png',
      });
    }
  };

  const updateReminderSettings = (data: Partial<ReminderSettings>) => {
    setReminderSettings(prev => ({ ...prev, ...data }));
  };

  const toggleReminders = () => {
    setReminderSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission === 'granted') {
      setPermissionStatus('granted');
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === 'granted';
    }
    
    return false;
  };

  return (
    <NotificationContext.Provider
      value={{
        reminderSettings,
        updateReminderSettings,
        toggleReminders,
        requestNotificationPermission,
        permissionStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;