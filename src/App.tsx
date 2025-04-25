import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Header from './components/Header';
import OnboardingForm from './components/OnboardingForm';
import { UserProvider, useUser } from './context/UserContext';
import { WaterIntakeProvider } from './context/WaterIntakeContext';
import { WeatherProvider } from './context/WeatherContext';
import { NotificationProvider } from './context/NotificationContext';

const AppContent: React.FC = () => {
  const { user } = useUser();
  
  // Check if user needs to be onboarded
  if (!user) {
    return <OnboardingForm />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <WaterIntakeProvider>
        <WeatherProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-gray-100">
                <AppContent />
              </div>
            </Router>
          </NotificationProvider>
        </WeatherProvider>
      </WaterIntakeProvider>
    </UserProvider>
  );
}

export default App;