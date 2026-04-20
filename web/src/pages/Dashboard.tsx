import React, { useState, useEffect } from 'react';
import { Zap, Wallet, Home, DollarSign, Trophy, User, Target, Play, Dices, ChevronDown, History as HistoryIcon, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onJoinTable: (tableName: string, minBuyIn: number) => void;
  user: { name: string; token: string };
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onJoinTable, user, onLogout }) => {
  const [view, setView] = useState<'main' | 'cashGames' | 'tournaments'>('main');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showSolde, setShowSolde] = useState(true);
  const [tables, setTables] = useState<any[]>([]);
  const [solde, setSolde] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState<'All' | 'holdem' | 'omaha'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 6;

  const slides = [
    { title: 'COIN REWARDS', desc: 'Gagnez des jetons en jouant', img: '/image/4.jpg' },
    { title: 'BONUS WEEKEND', desc: 'Jusqu\'à 200% de bonus', img: '/image/Poker_hero.png' },
    { title: 'TOURNOI MENSUEL', desc: 'Gagnez le ticket d\'or', img: '/image/poker.jpg' },
    { title: 'DAILY JACKPOT', desc: 'Tentez votre chance chaque jour', img: '/image/re.jfif' }
  ];

  const tableImages = ['/image/4.jpg', '/image/Poker_hero.png', '/image/poker.jpg', '/image/re.jfif'];

  const getTableImage = (id: number) => {
    const index = id % tableImages.length;
    return tableImages[index] || '/logo.ico';
  };

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  useEffect(() => {
    fetch('http://localhost:3001/api/solde', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setSolde(data.montant))
      .catch(err => console.error('Error fetching solde:', err));

    if (view === 'cashGames') {
      fetch('http://localhost:3001/api/tables', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setTables(data))
        .catch(err => console.error('Error fetching tables:', err));
    }
  }, [view, user.token]);

  const filteredTables = tables.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) &&
    (gameFilter === 'All' || t.gameType.toLowerCase() === gameFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
  const paginatedTables = filteredTables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/logo.ico" alt="Logo" className="w-8 h-8" />
            <div className="text-white font-black text-2xl tracking-tighter italic">AFRI<span className="text-yellow-500">POKS</span></div>
          </div>
          <div className="flex gap-6 text-sm font-bold text-gray-400">
            <span onClick={() => setView('main')} className={`${view === 'main' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-400'} py-5 cursor-pointer flex items-center gap-2`}><Trophy className="w-4 h-4" /> POKER</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-xs font-bold text-gray-500 flex items-center gap-1">● 1 Online</div>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30 relative">
            <Wallet className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500 cursor-pointer" onClick={() => { setShowWalletMenu(!showWalletMenu); setShowProfileMenu(false); }}>
              {solde !== null ? (showSolde ? `${Number(solde).toLocaleString('fr-FR')} MGA` : '•••• MGA') : '...'}
            </span>
            <button onClick={() => setShowSolde(!showSolde)} className="ml-1 text-yellow-500/70 hover:text-yellow-500">
              {showSolde ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            {showWalletMenu && (
              <div className="absolute top-10 right-0 w-48 bg-black border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-right">
                <button className="flex items-center justify-end gap-2 w-full px-4 py-2 text-sm hover:bg-white/10">Historique <HistoryIcon className="w-4 h-4" /></button>
                <button className="flex items-center justify-end gap-2 w-full px-4 py-2 text-sm hover:bg-white/10">Dépôt <DollarSign className="w-4 h-4" /></button>
                <button className="flex items-center justify-end gap-2 w-full px-4 py-2 text-sm hover:bg-white/10">Retrait <Wallet className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          <span className="text-sm font-bold text-white">{user.name}</span>
          <div className="relative">
            <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowWalletMenu(false); }} className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full border-2 border-yellow-400 p-0.5 overflow-hidden">
                <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user.name}`} alt="avatar" className="rounded-full w-full h-full" />
                <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showProfileMenu && (
              <div className="absolute top-12 right-0 w-48 bg-black border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-right">
                <button className="block w-full text-right px-4 py-2 text-sm hover:bg-white/10">Mon profil</button>
                <button className="block w-full text-right px-4 py-2 text-sm hover:bg-white/10">Mon compte</button>
                <button onClick={onLogout} className="block w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex gap-2 px-6 py-3 bg-black/20 border-b border-white/5 text-xs font-bold uppercase tracking-wider">
        <button onClick={() => setView('main')} className={`${view === 'main' ? 'bg-yellow-500 text-black' : 'hover:bg-white/5'} px-4 py-2 rounded-lg flex items-center gap-2`}><Home className="w-4 h-4" /> Home</button>
        <button onClick={() => setView('cashGames')} className={`${view === 'cashGames' ? 'bg-yellow-500 text-black' : 'hover:bg-white/5'} px-4 py-2 rounded-lg flex items-center gap-2`}><DollarSign className="w-4 h-4" /> Cash Games</button>
        <button onClick={() => setView('tournaments')} className={`${view === 'tournaments' ? 'bg-yellow-500 text-black' : 'hover:bg-white/5'} px-4 py-2 rounded-lg flex items-center gap-2`}><Trophy className="w-4 h-4" /> Tournaments <span className="text-[10px] bg-red-600 px-1 rounded ml-1">NEW</span></button>
      </div>

      <main className="p-6 max-w-[1600px] mx-auto">
        {view === 'main' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[80vh]">
            {/* Left Column: Coin Rewards Banner */}
            <div className="lg:col-span-3">
              <div className="relative h-full rounded-3xl overflow-hidden border border-white/10 group bg-gradient-to-b from-gray-900 to-black">
                <img 
                  src={slides[currentSlide].img} 
                  className="w-full h-full object-cover opacity-80 transition-opacity duration-1000" 
                  alt={slides[currentSlide].title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute top-12 left-0 right-0 text-center px-4">
                   <h1 className="text-4xl font-black italic tracking-tighter text-yellow-500 drop-shadow-2xl uppercase">
                     {slides[currentSlide].title.split(' ').map((word, i) => (
                       <React.Fragment key={i}>
                         {word}
                         {i === 0 && <br/>}
                       </React.Fragment>
                     ))}
                   </h1>
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">{slides[currentSlide].desc}</p>
                </div>
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
                   {slides.map((_, i) => (
                     <div 
                        key={i} 
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1 rounded-full transition-all cursor-pointer ${i === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                     ></div>
                   ))}
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-3xl border border-white/10 p-12 text-center flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)]"></div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 relative z-10">JOUEZ AU MOINS 1 TOURNOI POUR</h2>
                <h3 className="text-2xl font-black text-yellow-500 italic relative z-10">ÊTRE CLASSÉ AU SCORE DE COMPÉTENCE</h3>
                <div className="mt-6 h-px w-32 bg-white/10 relative z-10"></div>
                <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] relative z-10">COMMENCEZ À JOUER MAINTENANT</p>
              </div>

              {/* Grid: Formats + Transactions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/30 rounded-3xl border border-white/5 p-6 space-y-6">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">EXPLORE POKER FORMATS</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div onClick={() => setView('cashGames')} className="aspect-square bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center gap-3 hover:border-yellow-500/50 transition-all cursor-pointer group">
                         <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6 text-yellow-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase text-center">Cash Games</span>
                      </div>
                      <div onClick={() => setView('tournaments')} className="aspect-square bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center gap-3 hover:border-yellow-500/50 transition-all cursor-pointer group">
                         <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Trophy className="w-6 h-6 text-green-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase text-center">Tournaments</span>
                      </div>
                      <div className="aspect-square bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center gap-3 hover:border-yellow-500/50 transition-all cursor-pointer group opacity-50">
                         <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-blue-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase text-center">All-In Fold</span>
                      </div>
                      <div className="aspect-square bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center gap-3 hover:border-yellow-500/50 transition-all cursor-pointer group opacity-50">
                         <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-purple-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase text-center">Practice</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-gray-900/30 rounded-3xl border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all h-[180px] flex flex-col justify-center">
                      <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                      <h4 className="text-lg font-black italic">My Transactions</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Check out your withdrawal and deposit status</p>
                      <div className="absolute top-6 right-6 p-2 bg-yellow-500/10 rounded-lg"><Zap className="w-4 h-4 text-yellow-500" /></div>
                   </div>
                   <div className="bg-gray-900/30 rounded-3xl border border-white/5 p-8 h-[160px] flex flex-col justify-center">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-black" />
                         </div>
                         <p className="text-[11px] font-bold text-gray-400">Use PokerIntel to understand your gameplay and improvise</p>
                      </div>
                      <div className="mt-6 flex justify-between items-center">
                         <div className="flex gap-1">
                            {[1,2,3,4].map(i => <div key={i} className={`h-1 w-4 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/10'}`}></div>)}
                         </div>
                         <div className="flex gap-2">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                            <ChevronRight className="w-4 h-4 text-white" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/30 rounded-3xl border border-white/10 p-8 h-full">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">GAME STATS</h4>
                
                <div className="bg-black/40 rounded-2xl p-1 mb-8 flex">
                   <button className="flex-1 py-3 bg-red-600 rounded-xl text-xs font-black uppercase italic tracking-wider">Cash</button>
                   <button className="flex-1 py-3 text-xs font-black uppercase italic tracking-wider text-gray-500">Tournament</button>
                </div>

                <div className="space-y-8">
                   <div className="flex justify-between items-center">
                      <div>
                         <div className="text-lg font-black">Monthly</div>
                         <div className="text-[10px] text-gray-500 font-bold uppercase">21 Mar - Today</div>
                      </div>
                      <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-black flex items-center gap-2">
                         MONTHLY <ChevronDown className="w-3 h-3" />
                      </div>
                   </div>

                   <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Time Played</div>
                      <div className="text-3xl font-black italic">0d <span className="text-yellow-500">0h</span> 0m</div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                         <div className="text-[9px] text-gray-500 font-black uppercase mb-2">Sessions</div>
                         <div className="text-xl font-black">0</div>
                      </div>
                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                         <div className="text-[9px] text-gray-500 font-black uppercase mb-2">Top Hand</div>
                         <div className="text-xl font-black">-</div>
                      </div>
                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                         <div className="text-[9px] text-gray-500 font-black uppercase mb-2">Hands Played</div>
                         <div className="text-xl font-black">0</div>
                      </div>
                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                         <div className="text-[9px] text-gray-500 font-black uppercase mb-2">Stakes</div>
                         <div className="text-xl font-black">-</div>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-purple-900/40 to-black rounded-3xl border border-white/5 p-6 relative overflow-hidden group">
                      <div className="relative z-10">
                         <h5 className="text-sm font-black italic">Splash the pot</h5>
                         <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Splash is now live</p>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-full">
                         <img src="/logo.ico" className="w-full h-full object-contain opacity-20 scale-150 translate-x-10 translate-y-5" alt="" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left side: Stats or filter info */}
            <div className="md:col-span-3 space-y-6">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h2 className="text-sm font-black tracking-widest mb-6 uppercase text-yellow-500">FILTRES</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Rechercher</label>
                            <input 
                                type="text" 
                                placeholder="Nom de la table..." 
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Type de jeu</label>
                            <div className="flex flex-col gap-2">
                                {['All', 'holdem', 'omaha'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => { setGameFilter(type as any); setCurrentPage(1); }}
                                        className={`w-full px-4 py-2 rounded-xl text-xs font-bold uppercase text-left transition-all ${gameFilter === type ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h2 className="text-sm font-black tracking-widest mb-4 uppercase text-yellow-500">VOTRE RANG</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white uppercase">BRONZE II</div>
                            <div className="text-[10px] text-gray-500">Top 15% ce mois</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle: Table List */}
            <div className="md:col-span-9 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        {view === 'cashGames' ? 'CASH GAMES' : 'TOURNOIS'} 
                        <span className="text-yellow-500 ml-2">LOBBY</span>
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold flex items-center">{currentPage} / {totalPages || 1}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {view === 'cashGames' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedTables.length > 0 ? (
                            paginatedTables.map((t) => (
                                <div key={t.id} className="group relative w-full h-48 rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all bg-gray-900/40 backdrop-blur-sm">
                                    <img src={getTableImage(t.id)} className="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity group-hover:opacity-40" alt="Table background" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    
                                    <div className="absolute top-5 right-5 bg-yellow-500 text-black px-3 py-1 rounded-full shadow-lg">
                                        <span className="font-black text-[10px] tracking-wider uppercase">{t.cave} MGA</span>
                                    </div>
                                    
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-xl font-black leading-tight mb-2 text-white group-hover:text-yellow-500 transition-colors uppercase italic">{t.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Type</span>
                                                    <span className="text-xs font-black text-white">{t.gameType.toUpperCase()}</span>
                                                </div>
                                                <div className="w-px h-6 bg-white/10"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Joueurs</span>
                                                    <span className="text-xs font-black text-white flex items-center gap-1"><User className="w-3 h-3" /> {t.currentPlayers || 0}/9</span>
                                                </div>
                                                <div className="w-px h-6 bg-white/10"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Blinds</span>
                                                    <span className="text-xs font-black text-white">{t.smallBlind}/{t.bigBlind}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => onJoinTable(t.name, Number(t.cave))} 
                                                className="bg-white text-black h-10 w-10 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all hover:scale-110 active:scale-95"
                                            >
                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white/5 rounded-3xl border border-dashed border-white/10 p-20 flex flex-col items-center justify-center text-center">
                                <Dices className="w-16 h-16 text-gray-600 mb-4" />
                                <h3 className="text-xl font-black text-gray-400 uppercase">Aucune table trouvée</h3>
                                <p className="text-gray-600 text-sm mt-2">Essayez d'ajuster vos filtres de recherche</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-black/60 rounded-3xl border border-white/10 p-20 flex flex-col items-center justify-center text-center">
                        <Trophy className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-black text-gray-400 uppercase">Prochainement</h3>
                        <p className="text-gray-600 text-sm mt-2">Les tournois seront disponibles dans la prochaine mise à jour</p>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
