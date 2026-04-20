import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { PokerTable } from './components/PokerTable';
import { Dashboard } from './pages/Dashboard';
import { AuthForm } from './pages/AuthForm';
import { Alert } from './components/Alert';
import { LogIn, Coins, Wallet, History, User, LogOut, ChevronDown, ArrowUpCircle, CheckCircle2, XCircle, Zap } from 'lucide-react';

function App() {
  const { socket, tableData, error, joinTable, leaveTable, sendAction } = useSocket();
  const [user, setUser] = useState<{token: string, name: string} | null>(() => {
    const savedUser = localStorage.getItem('poker_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [buyIn, setBuyIn] = useState('1000');
  const [minBuyIn, setMinBuyIn] = useState(0);
  const [solde, setSolde] = useState<number | null>(null);
  const [raiseAmount, setRaiseAmount] = useState(100);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{message: string, type: 'error'|'success'|'info'} | null>(null);

  useEffect(() => {
    const lastTable = localStorage.getItem('active_table');
    if (user && lastTable && !isReadyToPlay && socket?.connected) {
      joinTable(user.name, lastTable, '0');
      setIsReadyToPlay(true);
    }
  }, [user, socket?.connected]);

  useEffect(() => {
    if (error) {
      // Don't show alert if it's just a buy-in validation error during a background reconnection
      // or if we are not currently in the join form.
      if (error.includes('montant minimum') && !showJoinForm) {
        console.log("Background buy-in check failed, ignoring alert.");
      } else {
        setAlertConfig({ message: error, type: 'error' });
      }
      setIsReadyToPlay(false);
      setShowJoinForm(false);
      localStorage.removeItem('active_table');
    }
  }, [error, showJoinForm]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('poker_user', JSON.stringify(user));
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        window.history.pushState({}, '', '/dashboard');
      }
      fetchSolde();
    } else {
      localStorage.removeItem('poker_user');
      localStorage.removeItem('active_table');
      window.history.pushState({}, '', '/login');
    }
  }, [user]);

  useEffect(() => {
    if (isReadyToPlay && tableData && socket) {
      const myPlayer = tableData.players.find((p: any) => p.name === user?.name);
      if (myPlayer && myPlayer.chips <= 0 && tableData.gameState === 'waiting' && tableData.pot === 0) {
          setAlertConfig({ message: "Plus de jetons ! Veuillez recaver pour continuer.", type: 'info' });
          leaveTable();
          setIsReadyToPlay(false);
          setShowJoinForm(true); 
          setBuyIn(minBuyIn.toString());
      }
    }
  }, [tableData, isReadyToPlay, socket, user?.name, leaveTable, minBuyIn]);

  const fetchSolde = () => {
    if (!user) return;
    fetch('http://localhost:3001/api/solde', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setSolde(data.montant))
      .catch(err => console.error('Error fetching solde:', err));
  };

  const handleLogout = () => {
    setUser(null);
    setIsReadyToPlay(false);
    setShowJoinForm(false);
    localStorage.removeItem('active_table');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(buyIn);
    if (amount < minBuyIn) {
      setAlertConfig({ message: `Minimum ${minBuyIn} MGA`, type: 'error' });
      return;
    }
    if (solde !== null && amount > solde) {
      setAlertConfig({ message: `Solde insuffisant (${solde} MGA)`, type: 'error' });
      return;
    }
    if (user) {
      joinTable(user.name, selectedTable, buyIn); 
      setIsReadyToPlay(true);
      setShowJoinForm(false);
      localStorage.setItem('active_table', selectedTable);
      window.history.pushState({}, '', `/table/${selectedTable}`);
      setTimeout(fetchSolde, 1000);
    }
  };

  const isMyTurn = tableData && socket && tableData.players[tableData.currentPlayerIndex]?.id === socket.id;
  const myPlayer = tableData?.players.find((p: any) => p.name === user?.name);
  const currentBet = tableData?.currentBet || 0;
  const myBet = myPlayer?.bet || 0;
  const callAmount = Math.max(0, currentBet - myBet);
  const maxChips = myPlayer?.chips || 0;
  
  const currentMinRaise = tableData ? (tableData.currentBet + Math.max(tableData.bigBlind || 20, tableData.currentBet - (tableData.previousBet || 0))) : 40;
  
  useEffect(() => {
    if (isMyTurn && raiseAmount < currentMinRaise) {
      setRaiseAmount(Math.min(maxChips + myBet, currentMinRaise));
    }
  }, [isMyTurn, currentMinRaise, maxChips, myBet]);

  const progressPercent = Math.min(100, (raiseAmount / (maxChips + myBet || 1)) * 100);

  if (!user) {
    return <AuthForm onSuccess={(token, name) => setUser({ token, name })} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {alertConfig && (
        <Alert message={alertConfig.message} type={alertConfig.type} onClose={() => setAlertConfig(null)} />
      )}

      {showJoinForm ? (
        <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] flex items-center justify-center p-4">
          <form onSubmit={handleJoin} className="bg-gradient-to-br from-gray-900/70 to-black/70 p-10 rounded-3xl border border-white/10 backdrop-blur-lg flex flex-col items-center gap-6 shadow-3xl">
            <h2 className="text-2xl font-bold text-yellow-400 italic text-center uppercase tracking-tighter">Rejoindre {selectedTable || localStorage.getItem('active_table')}</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Solde</div>
                <div className="text-white font-black text-lg">{solde?.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 text-center">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Min</div>
                <div className="text-yellow-500 font-black text-lg">{minBuyIn}</div>
              </div>
            </div>
            <input type="number" className="bg-black/60 border border-white/10 rounded-2xl px-6 py-4 w-72 text-white font-black text-center focus:border-yellow-500/50 outline-none" value={buyIn} onChange={(e) => setBuyIn(e.target.value)} />
            <button type="submit" className="bg-yellow-500 text-black font-black py-4 px-10 rounded-2xl w-72 hover:bg-yellow-400 transition-all uppercase tracking-widest">RECAVER / S'ASSEOIR</button>
            <button type="button" onClick={() => { setShowJoinForm(false); window.history.pushState({}, '', '/dashboard'); }} className="text-gray-500 hover:text-white text-[10px] font-black uppercase">Retour Lobby</button>
          </form>
        </div>
      ) : !isReadyToPlay ? (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onJoinTable={(tableName, min) => {
            setSelectedTable(tableName);
            setMinBuyIn(min);
            setBuyIn(min.toString());
            setShowJoinForm(true);
          }} 
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden relative">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)' }}></div>

          <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg"><Coins className="text-black w-8 h-8" /></div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic uppercase">AFRI<span className="text-yellow-500">POKS</span></h1>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest opacity-50">Decentralized Table</p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-16 pb-20">
            <div className="absolute top-8 right-8 flex items-center gap-6 z-30">
              <div className="flex items-center gap-2 bg-black/40 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
                  <Wallet className="w-4 h-4 text-yellow-500" />
                  <span className="font-mono font-black text-sm">{myPlayer?.chips || 0} MGA</span>
              </div>
              <div className="relative">
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-full border border-white/10 hover:border-yellow-500/50 transition-all backdrop-blur-md">
                      <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user.name}`} className="w-8 h-8 rounded-full" alt="avatar" />
                      <ChevronDown className="w-4 h-4 mr-1 text-gray-500" />
                  </button>
                  {showProfileMenu && (
                      <div className="absolute top-14 right-0 bg-black/90 border border-white/10 rounded-2xl w-48 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
                          <button onClick={() => { leaveTable(); setIsReadyToPlay(false); localStorage.removeItem('active_table'); window.history.pushState({}, '', '/dashboard'); }} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-white/5 text-xs font-bold text-gray-300 transition-colors uppercase tracking-wider"><LogOut className="w-4 h-4 text-blue-400" /> Quitter la table</button>
                          <div className="h-px bg-white/5 my-2"></div>
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-red-500/10 text-xs font-bold text-red-500 transition-colors uppercase tracking-wider"><LogOut className="w-4 h-4" /> Déconnexion</button>
                      </div>
                  )}
              </div>
            </div>

            <div className="mt-20 transform scale-[0.85] lg:scale-100 transition-transform">
              <PokerTable tableData={tableData} currentUserId={socket?.id} />
            </div>

            <div className={`flex flex-col items-center gap-8 transition-all duration-700 ${isMyTurn ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none grayscale'}`}>
              <div className="flex gap-10 items-end">
                <button onClick={() => sendAction('fold')} className="group flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-red-950/20 border-2 border-red-500/30 rounded-[2rem] flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all shadow-xl group-hover:scale-110 active:scale-95">
                    <XCircle className="w-12 h-12 text-red-500 group-hover:text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">FOLD</span>
                </button>

                <button 
                   onClick={() => sendAction(callAmount > 0 ? 'call' : 'check')} 
                   className="group flex flex-col items-center gap-3"
                >
                  <div className="w-24 h-24 bg-green-950/20 border-2 border-green-500/30 rounded-[2rem] flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all shadow-xl group-hover:scale-110 active:scale-95">
                    <CheckCircle2 className="w-12 h-12 text-green-500 group-hover:text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">{callAmount > 0 ? `CALL ${callAmount}` : 'CHECK'}</span>
                </button>

                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl">
                  <div className="relative flex items-center bg-black/60 rounded-[1.8rem] px-8 border border-white/5 h-24 overflow-hidden min-w-[200px]">
                    <div className="absolute left-0 bottom-0 top-0 bg-yellow-500/10 transition-all duration-300 pointer-events-none" style={{ width: `${progressPercent}%` }}></div>
                    <div className="flex flex-col items-start relative z-10">
                       <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 opacity-50">Mise totale</span>
                       <div className="flex items-baseline gap-2">
                         <input type="number" value={raiseAmount} onChange={(e) => setRaiseAmount(Math.min(maxChips + myBet, Math.max(0, parseInt(e.target.value) || 0)))} className="bg-transparent text-white font-black w-32 focus:outline-none text-3xl" />
                         <span className="text-yellow-500 font-black text-xs uppercase opacity-80">MGA</span>
                       </div>
                    </div>
                  </div>
                  <button onClick={() => sendAction('raise', raiseAmount)} className="group flex flex-col items-center gap-2 pr-2">
                    <div className="w-20 h-20 bg-yellow-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-yellow-400 transition-all shadow-lg group-hover:scale-105 active:scale-95">
                      <ArrowUpCircle className="w-10 h-10 text-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">RAISE</span>
                  </button>
                </div>

                <button 
                  onClick={() => sendAction('all-in')} 
                  className="group flex flex-col items-center gap-3 ml-2"
                >
                  <div className="w-24 h-24 bg-yellow-950/20 border-2 border-yellow-500/30 rounded-[2rem] flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 group-hover:text-black transition-all shadow-xl group-hover:shadow-yellow-500/20 group-hover:scale-110 active:scale-95">
                    <Zap className="w-12 h-12 text-yellow-500 group-hover:text-black" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 group-hover:text-yellow-400 text-center">ALL IN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
