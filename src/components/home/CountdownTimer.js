import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = Math.max(0, new Date(targetDate) - new Date());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1 text-gray-700">
      <span className="text-xs text-gray-500">Ends in:</span>
      {[timeLeft.h, timeLeft.m, timeLeft.s].map((v, i) => (
        <React.Fragment key={i}>
          <span className="bg-gray-800 text-white text-xs font-mono font-bold px-2 py-1 rounded min-w-[30px] text-center">
            {pad(v)}
          </span>
          {i < 2 && <span className="text-gray-500 font-bold text-sm">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
