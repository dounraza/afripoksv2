import React from 'react';

interface CardProps {
  value: string;
  suit: string;
  hidden?: boolean;
}

const suitColors: Record<string, string> = {
  h: 'text-red-600',   // Hearts -> Red
  d: 'text-red-600',   // Diamonds -> Red
  c: 'text-gray-900',  // Clubs -> Black
  s: 'text-gray-900',  // Spades -> Black
};

const suitIcons: Record<string, string> = {
  h: '♥',
  d: '♦',
  c: '♣',
  s: '♠',
};

export const Card: React.FC<CardProps> = ({ value, suit, hidden }) => {
  if (hidden) {
    return (
      <div className="w-20 h-28 bg-blue-800 border-2 border-white rounded-lg shadow-xl flex items-center justify-center">
        <div className="w-12 h-18 border border-white/20 rounded-md bg-blue-700/50"></div>
      </div>
    );
  }

  return (
    <div className={`w-20 h-28 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col items-center justify-between p-2 font-black ${suitColors[suit]}`} style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, transparent 100%)' }}>
      <div className="text-lg self-start leading-none">{value}</div>
      <div className="text-4xl leading-none">{suitIcons[suit]}</div>
      <div className="text-lg self-end rotate-180 leading-none">{value}</div>
    </div>
  );
};
