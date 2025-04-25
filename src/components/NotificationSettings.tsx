import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, BellOff } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { 
    reminderSettings, 
    updateReminderSettings, 
    toggleReminders,
    requestNotificationPermission,
    permissionStatus
  } = useNotification();
  
  const handlePermissionRequest = async () => {
    const granted = await requestNotificationPermission();
    if (granted && !reminderSettings.enabled) {
      toggleReminders();
    }
  };
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateReminderSettings({ interval: parseInt(e.target.value, 10) });
  };
  
  const handleTimeChange = (type: 'startTime' | 'endTime', value: string) => {
    updateReminderSettings({ [type]: value });
  };
  
  if (permissionStatus === 'denied') {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <BellOff size={20} className="text-gray-500 mr-2" />
          <h3 className="text-gray-700 font-medium">Notifications Blocked</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Notification permissions are blocked in your browser. Please update your browser settings to enable notifications.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell size={20} className="text-blue-500 mr-2" />
          <h3 className="text-gray-700 font-medium">Hydration Reminders</h3>
        </div>
        
        {permissionStatus === 'granted' ? (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={reminderSettings.enabled}
              onChange={toggleReminders}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        ) : (
          <button
            onClick={handlePermissionRequest}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            Enable Notifications
          </button>
        )}
      </div>
      
      {permissionStatus === 'granted' && (
        <div className="pt-2 border-t border-gray-100">
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">
              Remind me every:
            </label>
            <select
              value={reminderSettings.interval}
              onChange={handleIntervalChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={!reminderSettings.enabled}
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start time:
              </label>
              <input
                type="time"
                value={reminderSettings.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!reminderSettings.enabled}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                End time:
              </label>
              <input
                type="time"
                value={reminderSettings.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!reminderSettings.enabled}
              />
            </div>
          </div>
          
          {reminderSettings.enabled && (
            <p className="text-xs text-gray-500 mt-3">
              You will receive reminders from {reminderSettings.startTime} to {reminderSettings.endTime} every {reminderSettings.interval} minutes.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;