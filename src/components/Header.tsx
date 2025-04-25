import React from 'react';
import { useUser } from '../context/UserContext';
import { Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user } = useUser();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Droplets size={28} className="text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-blue-700">HydroBuddy</h1>
        </Link>
        
        <nav className="flex items-center">
          <Link 
            to="/" 
            className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          
          <Link 
            to="/history" 
            className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            History
          </Link>
          
          <Link 
            to="/settings" 
            className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            Settings
          </Link>
          
          {user && (
            <div className="ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700">{user.name}</span>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;