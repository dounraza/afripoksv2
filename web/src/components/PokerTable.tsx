import React from 'react';
import { PlayerSlot } from './PlayerSlot';
import { Card } from './Card';
import { ChipPot } from './ChipPot';
import { Trophy } from 'lucide-react';

interface PokerTableProps {
  tableData: any;
  currentUserId: string | undefined;
}

const PLAYER_POSITIONS = [
  'bottom-[-4%] left-[50%] -translate-x-1/2', // 1: Bottom center
  'bottom-[25%] left-[-4%]',                  // 2: Mid-left-bottom
  'top-[25%] left-[-4%]',                     // 3: Mid-left-top
  'top-[-2%] left-[10%]',                     // 4: Top-left-corner
  'top-[-5%] left-[40%]',                     // 5: Top center-left
  'top-[-5%] right-[40%]',                    // 6: Top center-right
  'top-[-2%] right-[10%]',                    // 7: Top-right-corner
  'top-[25%] right-[-4%]',                    // 8: Mid-right-top
  'bottom-[25%] right-[-4%]',                 // 9: Mid-right-bottom
];

export const PokerTable: React.FC<PokerTableProps> = ({ tableData, currentUserId }) => {
  if (!tableData) return null;

  const isShowdown = tableData.gameState === 'showdown';
  const winnerIds = tableData.winnerInfo?.map((w: any) => w.playerId) || [];
  const players = tableData.players || [];
  const communityCards = tableData.communityCards || [];

  const [prevPhase, setPrevPhase] = React.useState(tableData.currentPhase);
  const [shouldGather, setShouldGather] = React.useState(false);

  React.useEffect(() => {
    if (tableData.currentPhase !== prevPhase) {
      setShouldGather(true);
      const timer = setTimeout(() => {
        setShouldGather(false);
        setPrevPhase(tableData.currentPhase);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tableData.currentPhase, prevPhase]);

  const winningPlayerIndex = players.findIndex((p: any) => winnerIds.includes(p.id));
  const winnerSeat = winningPlayerIndex !== -1 ? players[winningPlayerIndex].position : -1;
  
  // Target translations based on SEAT POSITION relative to table center (0,0)
  const targetTranslations = [
    { x: '0px', y: '200px' },    // Seat 0 (bottom)
    { x: '-350px', y: '120px' },  // Seat 1
    { x: '-350px', y: '-120px' }, // Seat 2
    { x: '-200px', y: '-220px' }, // Seat 3
    { x: '-80px', y: '-220px' },  // Seat 4
    { x: '80px', y: '-220px' },   // Seat 5
    { x: '200px', y: '-220px' },  // Seat 6
    { x: '350px', y: '-120px' },  // Seat 7
    { x: '350px', y: '120px' },   // Seat 8
  ];

  const dealOrigins = [
    { x: '0px', y: '-120px' },
    { x: '250px', y: '-80px' },
    { x: '400px', y: '0px' },
    { x: '250px', y: '80px' },
    { x: '120px', y: '150px' },
    { x: '-120px', y: '150px' },
    { x: '-250px', y: '80px' },
    { x: '-400px', y: '0px' },
    { x: '-250px', y: '-80px' },
  ];

  const winnerPos = winnerSeat !== -1 ? targetTranslations[winnerSeat] : { x: '0px', y: '0px' };

  return (
    <div className="relative w-[75vw] aspect-[2.2/1] bg-gradient-to-br from-[#1e5a3d] to-[#0a2e1a] rounded-[300px] border-[16px] border-[#3d2b1f] shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_150px_rgba(0,0,0,0.5)] flex items-center justify-center">
      <div className="absolute inset-[8px] rounded-[280px] border-[4px] border-[#2c6e49]"></div>
      <div className="absolute inset-0 rounded-[300px] bg-[url('/public/felt-texture.png')] bg-cover opacity-10 pointer-events-none"></div>

      <div className="flex flex-col items-center gap-5 z-10 mt-6">
        <div style={{ '--target-x': winnerPos.x, '--target-y': winnerPos.y } as any}>
          <ChipPot amount={tableData.pot} winnerPosition={isShowdown ? 'active' : undefined} />
        </div>
        
        <div className="h-32 flex items-center justify-center gap-2.5 overflow-hidden px-6 bg-black/40 rounded-xl shadow-inner border-2 border-white/10">
          {communityCards.map((card: any, idx: number) => (
            <div 
              key={`${tableData.gameState}-${idx}`} 
              style={{ animationDelay: `${idx * 200}ms` }} 
              className="animate-card-slide transform hover:scale-110 transition-transform duration-200"
            >
              <Card value={card.value} suit={card.suit} hidden={false} />
            </div>
          ))}
          {Array.from({ length: 5 - communityCards.length }).map((_, i) => (
            <div key={i} className="w-20 h-28 border-2 border-dashed border-gray-600/50 rounded-lg flex items-center justify-center text-gray-700 text-lg font-black">?</div>
          ))}
        </div>
        
        {/* 
        <div className="flex flex-col items-center gap-4">
          <div className="text-green-300 font-black text-3xl uppercase tracking-[0.3em] bg-black/60 px-8 py-3 rounded-full border-2 border-green-500/30 shadow-2xl">
              {tableData.currentPhase}
          </div>
        </div>
        */}
      </div>

      {Array.from({ length: 9 }).map((_, idx) => {
        const player = players.find((p: any) => p.position === idx);
        if (!player) return null;

        const isWinner = winnerIds.includes(player.id) && isShowdown;
        const isDealer = player.id === players.find((p: any) => p.position === tableData.dealerIndex)?.id;
        
        return (
          <div key={player.id} className="transition-all duration-700">
            <PlayerSlot 
              player={player} 
              isActive={player.id === players[tableData.currentPlayerIndex]?.id}
              isWinner={isWinner}
              isDealer={isDealer}
              positionClass={PLAYER_POSITIONS[idx]}
              shouldGatherBets={shouldGather}
              dealOrigin={dealOrigins[idx]}
              seatNumber={idx}
              isShowdown={isShowdown}
            />
          </div>
        );
      })}
    </div>
  );
};
