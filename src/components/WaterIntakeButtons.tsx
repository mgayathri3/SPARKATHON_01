import React, { useState } from 'react';
import { useWaterIntake } from '../context/WaterIntakeContext';
import { Droplets } from 'lucide-react';

const WaterIntakeButtons: React.FC = () => {
  const { addWaterIntake } = useWaterIntake();
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const handleQuickAdd = (amount: number) => {
    addWaterIntake(amount);
    
    // Show ripple animation
    const button = document.getElementById(`add-${amount}`);
    if (button) {
      button.classList.add('animate-ripple');
      setTimeout(() => {
        button.classList.remove('animate-ripple');
      }, 700);
    }
  };
  
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      addWaterIntake(amount);
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Add Water</h2>
      
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button
          id="add-250"
          onClick={() => handleQuickAdd(250)}
          className="relative overflow-hidden bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105 active:scale-95"
        >
          <Droplets size={18} className="mr-1" />
          <span>250ml</span>
        </button>
        
        <button
          id="add-500"
          onClick={() => handleQuickAdd(500)}
          className="relative overflow-hidden bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105 active:scale-95"
        >
          <Droplets size={18} className="mr-1" />
          <span>500ml</span>
        </button>
        
        {showCustomInput ? (
          <form onSubmit={handleCustomSubmit} className="flex">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-20 px-2 py-2 border border-blue-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ml"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <Droplets size={18} className="mr-1" />
            <span>Custom</span>
          </button>
        )}
      </div>
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0px rgba(14, 165, 233, 0.4);
          }
          100% {
            box-shadow: 0 0 0 20px rgba(14, 165, 233, 0);
          }
        }
        
        .animate-ripple {
          animation: ripple 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WaterIntakeButtons;