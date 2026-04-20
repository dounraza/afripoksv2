import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { BetChips } from './BetChips';

interface PlayerSlotProps {
  player: any;
  isActive: boolean;
  isWinner: boolean;
  positionClass: string;
  shouldGatherBets: boolean;
  dealOrigin: { x: string; y: string };
  isDealer: boolean;
  seatNumber: number;
  isShowdown: boolean;
}

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ 
  player, isActive, isWinner, positionClass, shouldGatherBets, dealOrigin, isDealer, seatNumber, isShowdown
}) => {
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${player.name}&radius=50`;
  
  const [timeLeft, setTimeLeft] = useState(15);
  useEffect(() => {
    if (isActive) {
      setTimeLeft(15);
      const timer = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
      return () => clearInterval(timer);
    }
  }, [isActive]);

  return (
    <div className={`absolute flex flex-col items-center ${positionClass} ${isWinner ? 'z-30 scale-110' : 'z-20'} transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      
      {/* Bet Chips - Positioned above */}
      <BetChips amount={player.bet} position="top" shouldGather={shouldGatherBets} />

      {/* Player Cards - Positioned clearly ABOVE the slot to avoid overlap */}
      <div className="flex -space-x-6 -mb-8 h-28 items-end z-10 ml-4">
        {(player.cards && player.cards.length > 0 ? player.cards : [null, null]).map((card: any, idx: number) => (
          <div key={idx} className="animate-card-deal scale-[0.75] origin-bottom shadow-2xl transition-transform duration-200"
               style={{ '--deal-x': dealOrigin.x, '--deal-y': dealOrigin.y, animationDelay: `${idx * 150}ms` } as any}>
            {card ? <Card value={card.value} suit={card.suit} /> : <div className="w-20 h-28 bg-gray-800/80 rounded-lg border border-gray-600/50 backdrop-blur-sm" /> }
          </div>
        ))}
      </div>

      {/* MAIN SLOT BOX */}
      <div className={`relative w-44 rounded-xl border-2 p-1.5 shadow-2xl transition-all duration-300 transform origin-center scale-75
        ${isActive ? 'border-yellow-400 bg-black' : 'border-gray-700 bg-black/90'}
        ${isWinner ? 'border-yellow-300 ring-4 ring-yellow-500/30' : ''}
      `}>
        
        {/* AVATAR WITH CIRCULAR PROGRESS BAR */}
        <div className="absolute -left-5 bottom-0 w-14 h-14 rounded-full border-2 border-white/80 overflow-hidden bg-gray-900 shadow-xl z-30 relative flex items-center justify-center">
          {/* SVG for Circular Progress Bar */}
          {isActive && timeLeft > 0 && (
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#475569" // Equivalent to Tailwind's gray-700
                strokeWidth="8" 
                opacity="0.8"
              />
              {/* Progress fill */}
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#fde047" // Equivalent to Tailwind's yellow-400
                strokeWidth="8" 
                strokeDasharray="283" // Circumference for r=45 in a 100x100 viewBox
                strokeDashoffset={(((15 - timeLeft) / 15) * 283).toFixed(0)} // Dynamic offset for decreasing progress
                className="transition-all duration-1000 ease-linear" 
              />
            </svg>
          )}
          {/* Avatar Image */}
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full absolute inset-0 z-10" />
        </div>

        {/* INFO SECTION - Clearly separated from avatar and cards */}
        <div className="ml-12 flex flex-col items-start w-full">            <div className="text-white text-sm font-black truncate w-full uppercase tracking-wider">{player.name}</div>
            <div className="text-yellow-400 font-mono text-lg font-black leading-none mt-0.5">{player.chips} MGA</div>

        </div>

        {/* DEALER BUTTON - Positioned at the corner */}
        {isDealer && (
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg z-40">D</div>
        )}
      </div>

      {/* Hand Result (Showdown only) */}
      {player.handResult && isShowdown && (
        <div className="mt-2 px-3 py-1 rounded-full bg-yellow-600/20 border border-yellow-500/40 text-[10px] font-black text-yellow-400 uppercase tracking-widest shadow-lg">
          {player.handResult}
        </div>
      )}
    </div>
  );
};
