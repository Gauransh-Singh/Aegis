
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, RiskLevel } from '../types';

interface DashboardProps {
  alerts: Alert[];
}

const data = [
  { name: '00:00', risk: 12 },
  { name: '04:00', risk: 18 },
  { name: '08:00', risk: 35 },
  { name: '12:00', risk: 42 },
  { name: '16:00', risk: 28 },
  { name: '20:00', risk: 22 },
  { name: '24:00', risk: 15 },
];

const Dashboard: React.FC<DashboardProps> = ({ alerts }) => {
  const criticalCount = alerts.filter(a => a.severity === RiskLevel.CRITICAL).length;
  const preparednessScore = 74; // Mock community preparedness score

  return (
    <div className="flex flex-col h-full space-y-6 overflow-hidden">
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Risk Level Metrics */}
        <div className="col-span-12 lg:col-span-8 space-y-6 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all relative group">
              <p className="text-slate-400 text-sm mb-2 text-center font-mono uppercase tracking-widest">Readiness_Index</p>
              <h3 className="text-3xl font-black text-emerald-400 text-center">{preparednessScore}%</h3>
              <div className="mt-4 flex items-center justify-center text-[10px] text-emerald-400/70 font-bold uppercase tracking-wider">
                <i className="fa-solid fa-shield-check mr-1"></i> Pre-Disaster Safe
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all"></div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all relative overflow-hidden">
              <p className="text-slate-400 text-sm mb-2 text-center font-mono uppercase tracking-widest">Active_Intel</p>
              <h3 className="text-3xl font-black text-red-500 text-center">{alerts.length.toString().padStart(2, '0')}</h3>
              <div className="mt-4 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {criticalCount} Critical Nodes
              </div>
              {alerts.some(a => a.isLive) && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              )}
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all">
              <p className="text-slate-400 text-sm mb-2 text-center font-mono uppercase tracking-widest">Risk_Velocity</p>
              <h3 className="text-3xl font-black text-blue-400 text-center">Stable</h3>
              <div className="mt-4 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Artemis Net Nominal
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-[480px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-slate-100 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                 <i className="fa-solid fa-wave-square text-blue-500"></i>
                 Regional Vulnerability Matrix
              </h4>
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                 PROACTIVE SENSING ACTIVE
              </span>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full min-h-0">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex-1 flex flex-col min-h-0">
             <h4 className="text-slate-100 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <i className="fa-solid fa-bolt text-amber-500"></i>
               Intel Stream
            </h4>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {alerts.length > 0 ? alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border flex flex-col gap-2 transition-all hover:scale-[1.01] cursor-default ${
                  alert.severity === RiskLevel.CRITICAL ? 'bg-red-500/5 border-red-500/20' : 
                  alert.severity === RiskLevel.HIGH ? 'bg-orange-500/5 border-orange-500/20' : 
                  'bg-slate-800/50 border-slate-700'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase ${
                        alert.severity === RiskLevel.CRITICAL ? 'bg-red-500 text-white' : 
                        alert.severity === RiskLevel.HIGH ? 'bg-orange-500 text-white' : 
                        'bg-slate-600 text-slate-200'
                      }`}>
                        {alert.severity}
                      </span>
                      {alert.isLive && (
                        <span className="flex items-center gap-1 text-[9px] text-red-400 font-black tracking-widest bg-red-400/10 px-1.5 rounded-sm">
                           <span className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></span>
                           LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">{alert.time}</span>
                  </div>
                  <div>
                    <p className="text-slate-200 font-black text-sm uppercase tracking-tight">{alert.type}</p>
                    <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                      <i className="fa-solid fa-location-dot mr-1 text-blue-500"></i>{alert.location}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed line-clamp-2">"{alert.summary}"</p>
                  
                  {alert.sources && alert.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800/50">
                      <div className="flex flex-col gap-1.5">
                        {alert.sources.map((src, i) => (
                          <a 
                            key={i} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors truncate flex items-center gap-2 bg-blue-400/5 px-2 py-1 rounded-sm border border-blue-400/10"
                          >
                            <i className="fa-solid fa-link text-[8px]"></i>
                            {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-40">
                  <i className="fa-solid fa-satellite-dish text-4xl mb-4"></i>
                  <p className="text-xs uppercase font-black tracking-widest">Awaiting Uplink</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Ticker */}
      <div className="h-10 bg-slate-900 border-t border-slate-800 flex items-center overflow-hidden whitespace-nowrap">
        <div className="px-4 h-full flex items-center bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest z-10 shadow-xl">
          GLOBAL_COMM_TICKER
        </div>
        <div className="flex gap-12 animate-[marquee_30s_linear_infinite] px-8">
          {alerts.map(a => (
            <span key={a.id} className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${a.severity === RiskLevel.CRITICAL ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></span>
              [{a.type.toUpperCase()}] DETECTED IN {a.location.toUpperCase()} // SEVERITY: {a.severity.toUpperCase()} // RECON_STATUS: VERIFIED
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
