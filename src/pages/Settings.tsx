import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useWaterIntake } from '../context/WaterIntakeContext';
import NotificationSettings from '../components/NotificationSettings';
import { User, Trash2, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUser, calculateWaterGoal } = useUser();
  const { resetTodayIntake } = useWaterIntake();
  
  const [name, setName] = useState(user?.name || '');
  const [weight, setWeight] = useState(user?.weight.toString() || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  if (!user) return null;
  
  const handleSaveProfile = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) return;
    
    // Convert weight to kg if needed
    const weightInKg = weightUnit === 'lb' ? weightValue * 0.453592 : weightValue;
    
    // Calculate new water goal
    const waterGoal = calculateWaterGoal(weightInKg);
    
    updateUser({
      name: name.trim(),
      weight: weightInKg,
      waterGoal,
    });
  };
  
  const handleResetData = () => {
    // Clear localStorage
    localStorage.removeItem('hydrobuddy_user');
    localStorage.removeItem('hydrobuddy_history');
    localStorage.removeItem('hydrobuddy_reminder_settings');
    
    // Reload the page to reset the app state
    window.location.reload();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Settings
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <User size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Your Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  step="0.1"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
                  className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleSaveProfile}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <NotificationSettings />
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <RefreshCw size={20} className="text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-700">Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => resetTodayIntake()}
                className="w-full bg-orange-100 text-orange-700 border border-orange-200 py-2 px-4 rounded-md hover:bg-orange-200 transition-colors"
              >
                Reset Today's Intake
              </button>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-50 text-red-600 border border-red-100 py-2 px-4 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset All Data
                </button>
              ) : (
                <div className="border border-red-200 rounded-md p-3 bg-red-50">
                  <p className="text-sm text-red-600 mb-3">
                    This will delete all your data and cannot be undone. Are you sure?
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleResetData}
                      className="flex-1 bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Yes, Reset All
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;