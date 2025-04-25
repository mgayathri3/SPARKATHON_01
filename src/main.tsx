import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add custom styles for animations
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes wave {
    0% {
      transform: translateX(-25%) translateY(10%);
    }
    50% {
      transform: translateX(25%) translateY(0%);
    }
    100% {
      transform: translateX(-25%) translateY(10%);
    }
  }
  
  @keyframes ripple {
    0% {
      box-shadow: 0 0 0 0px rgba(14, 165, 233, 0.4);
    }
    100% {
      box-shadow: 0 0 0 20px rgba(14, 165, 233, 0);
    }
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .animate-ripple {
    animation: ripple 0.7s ease-out;
  }
  
  .animate-flicker {
    animation: flicker 2s infinite;
  }
  
  .water-wave {
    animation: wave 3s infinite ease-in-out;
  }
`;
document.head.appendChild(styleElement);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);