import React, { useState, useEffect } from 'react';

const Timer = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 300) return 'timer danger'; // 5 minutes or less
    if (timeLeft <= 600) return 'timer warning'; // 10 minutes or less
    return 'timer';
  };

  return (
    <div className={getTimerClass()}>
      <span>⏱️</span>
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;