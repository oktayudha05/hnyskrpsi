import React from 'react';

const Bee = ({ style }) => {
  return (
    <div 
      className="absolute animate-pulse" 
      style={{ ...style, animationDuration: '3s' }}
    >
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Badan Lebah */}
        <ellipse cx="50" cy="50" rx="25" ry="30" fill="#FACC15" />
        {/* Garis Badan */}
        <path d="M25 40 Q50 35 75 40" stroke="#713F12" strokeWidth="3" fill="none"/>
        <path d="M25 50 Q50 45 75 50" stroke="#713F12" strokeWidth="3" fill="none"/>
        <path d="M25 60 Q50 55 75 60" stroke="#713F12" strokeWidth="3" fill="none"/>
        {/* Sayap */}
        <ellipse cx="35" cy="45" rx="12" ry="20" fill="#FBCFE8" opacity="0.7" transform="rotate(-20 35 45)"/>
        <ellipse cx="65" cy="45" rx="12" ry="20" fill="#FBCFE8" opacity="0.7" transform="rotate(20 65 45)"/>
        {/* Mata */}
        <circle cx="40" cy="40" r="4" fill="#1C1917"/>
        <circle cx="60" cy="40" r="4" fill="#1C1917"/>
        {/* Senyum */}
        <path d="M42 52 Q50 58 58 52" stroke="#1C1917" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export default Bee;