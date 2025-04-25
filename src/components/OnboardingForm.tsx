import React, { useState, FormEvent } from 'react';
import { useUser } from '../context/UserContext';
import { Badge } from '../types';

const OnboardingForm: React.FC = () => {
  const { setUser, calculateWaterGoal } = useUser();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight');
      return;
    }
    
    // Convert weight to kg if needed
    const weightInKg = weightUnit === 'lb' ? weightValue * 0.453592 : weightValue;
    
    // Calculate water goal
    const waterGoal = calculateWaterGoal(weightInKg);
    
    // Create default badges
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
    
    // Create user
    setUser({
      name: name.trim(),
      weight: weightInKg,
      waterGoal,
      streak: 0,
      badges: defaultBadges,
    });
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Welcome to HydroBuddy!</h2>
        <p className="text-gray-600">Let's set up your personalized water intake goals.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-6">
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
              placeholder="Enter your weight"
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
          <p className="text-xs text-gray-500 mt-1">
            We'll use this to calculate your recommended daily water intake.
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Your data is stored locally and never shared with anyone.</p>
      </div>
    </div>
  );
};

export default OnboardingForm;