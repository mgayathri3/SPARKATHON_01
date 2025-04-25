import React, { useEffect, useState } from 'react';
import { useWaterIntake } from '../context/WaterIntakeContext';
import { useUser } from '../context/UserContext';

interface WaterProgressCircleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const WaterProgressCircle: React.FC<WaterProgressCircleProps> = ({
  showLabel = true,
  size = 'lg',
}) => {
  const { getTodayPercentage, todayIntake } = useWaterIntake();
  const { user } = useUser();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const percentage = getTodayPercentage();
  
  useEffect(() => {
    // Animate the percentage change
    const animationDuration = 1000; // 1 second
    const framesPerSecond = 60;
    const totalFrames = animationDuration / (1000 / framesPerSecond);
    const increment = percentage / totalFrames;
    
    let currentFrame = 0;
    let currentValue = 0;
    
    const timer = setInterval(() => {
      currentFrame++;
      currentValue += increment;
      
      if (currentFrame >= totalFrames) {
        clearInterval(timer);
        setAnimatedPercentage(percentage);
      } else {
        setAnimatedPercentage(currentValue);
      }
    }, 1000 / framesPerSecond);
    
    return () => clearInterval(timer);
  }, [percentage]);
  
  // Calculate circle dimensions
  const circleSize = {
    sm: 100,
    md: 150,
    lg: 200,
  }[size];
  
  const strokeWidth = {
    sm: 6,
    md: 8,
    lg: 10,
  }[size];
  
  const textSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];
  
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={circleSize}
        height={circleSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="#E0F2FE"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300 ease-in-out"
        />
        
        {/* Wave background (purely decorative) */}
        <defs>
          <clipPath id="wave-clip">
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius - strokeWidth / 2}
            />
          </clipPath>
        </defs>
        
        {/* Animated water level */}
        <rect
          className="water-wave origin-bottom"
          clipPath="url(#wave-clip)"
          x="0"
          y={circleSize - (animatedPercentage / 100) * circleSize}
          width={circleSize}
          height={circleSize}
          fill="url(#water-gradient)"
          style={{ 
            transition: 'y 0.5s ease-out',
            animation: 'wave 3s infinite ease-in-out' 
          }}
        />
        
        <defs>
          <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
      
      {showLabel && (
        <div className="text-center mt-4">
          <p className={`font-bold ${textSize} text-blue-600`}>
            {Math.round(animatedPercentage)}%
          </p>
          <p className="text-gray-600">
            {todayIntake.amount}ml / {user?.waterGoal}ml
          </p>
        </div>
      )}
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default WaterProgressCircle;