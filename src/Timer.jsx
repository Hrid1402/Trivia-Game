import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ initialTime = 30, onTimeUp, paused, onReset}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [onReset, initialTime]);

  useEffect(() => {
    let timer;
    if (timeLeft <= 0 || paused) return;
  
    timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (paused) {
          clearInterval(timer);
          return prevTime;
        }
  
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, onTimeUp, paused]);

  const progress = (timeLeft / initialTime) * 100;

  const getColor = () => {
    if (timeLeft > initialTime * 0.6) return 'bg-green-500';
    if (timeLeft > initialTime * 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-center font-bold text-lg">
        {timeLeft}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getColor()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CountdownTimer;