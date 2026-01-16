
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount: number;
  onSync: () => void;
  isSyncing: boolean;
  isThrottled: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, alertCount, onSync, isSyncing, isThrottled }) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: 'fa-chart-line' },
    { id: 'satellite', label: 'Satellite Intel', icon: 'fa-satellite' },
    { id: 'social', label: 'Social Intel', icon: 'fa-users' },
    { id: 'globe', label: 'Globe Command', icon: 'fa-earth-americas' },
    { id: 'response', label: 'Response Hub', icon: 'fa-truck-fast' },
    { id: 'archives', label: 'Data Archives', icon: 'fa-box-archive' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      <aside className="w-64 border-r border-slate-800 flex flex-col glass z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-500 mb-8">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">Aegis <span className="text-blue-400 font-light">CMD</span></h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-black">Orbital Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${alertCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} `}></div>
              <span className={`text-[10px] font-black uppercase tracking-wider ${alertCount > 0 ? 'text-amber-400' : 'text-green-400'}`}>{alertCount > 0 ? `${alertCount} Active Incidents` : 'Global Nominal'}</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 glass z-40">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xs font-black text-slate-100 uppercase tracking-[0.2em]">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">UPLINK_STABILITY: NOMINAL_99.9</div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                {isThrottled && <span className="text-[9px] text-amber-500 font-black animate-pulse px-3 py-1 bg-amber-500/10 rounded-sm border border-amber-500/20 uppercase">RECON_QUOTA_LIMITED</span>}
                <button onClick={onSync} disabled={isSyncing} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${isSyncing ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/10'}`}>
                  {isSyncing ? <><i className="fa-solid fa-satellite-dish animate-spin"></i> SYNCING...</> : <><i className="fa-solid fa-rotate"></i> REFRESH INTEL</>}
                </button>
             </div>
             <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3 pl-4 border-l border-slate-800">
              <i className="fa-solid fa-clock"></i>{new Date().toLocaleTimeString()} UTC
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
