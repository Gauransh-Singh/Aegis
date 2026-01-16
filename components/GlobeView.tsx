
import React, { useState } from 'react';
import { Alert } from '../types';

interface GlobeViewProps {
  alerts: Alert[];
}

const GlobeView: React.FC<GlobeViewProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const orbitalMapUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg';

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const activeAlerts = alerts.filter(a => !a.isPrediction);
  const predictedAlerts = alerts.filter(a => a.isPrediction);

  return (
    <div className="flex flex-col h-full space-y-6 min-h-0">
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-9 bg-slate-900/50 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col shadow-2xl">
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-slate-950/90 to-transparent z-[50] pointer-events-none">
            <div className="space-y-2 pointer-events-auto">
              <h4 className="text-slate-100 font-semibold flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 backdrop-blur-md shadow-lg">
                <i className="fa-solid fa-satellite text-blue-500 animate-pulse"></i> Tactical Map
              </h4>
            </div>
            <div className="flex gap-4 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 backdrop-blur-md shadow-lg pointer-events-auto">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Active</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Forecast</div>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-950 overflow-hidden">
            <img src={orbitalMapUrl} className="w-full h-full object-cover select-none brightness-50 grayscale hover:grayscale-0 transition-all duration-1000" alt="Orbital Backdrop" />
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
              {alerts.map((alert) => {
                const { x, y } = getPosition(alert.coordinates.lat, alert.coordinates.lng);
                const color = alert.isPrediction ? '#f59e0b' : '#ef4444';
                return (
                  <g key={alert.id} className="cursor-pointer pointer-events-auto group" onClick={() => setSelectedAlert(alert)}>
                    <circle cx={`${x}%`} cy={`${y}%`} r="12" fill="transparent" />
                    <circle cx={`${x}%`} cy={`${y}%`} r="10" fill={color} fillOpacity="0.2" className="animate-ping" />
                    <circle cx={`${x}%`} cy={`${y}%`} r="5" fill={color} stroke="white" strokeWidth="1.5" className="group-hover:r-6 transition-all" />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="h-48 bg-slate-950/95 border-t border-slate-800 z-[100] p-6 backdrop-blur-xl">
            {selectedAlert ? (
              <div className="flex gap-8 items-start h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${selectedAlert.isPrediction ? 'bg-amber-500' : 'bg-red-600'} text-white uppercase`}>{selectedAlert.isPrediction ? 'PRED' : 'LIVE'}</span>
                    <h3 className="text-xl font-black text-slate-100">{selectedAlert.type}</h3>
                  </div>
                  <p className="text-sm font-bold text-blue-400 mb-2">{selectedAlert.location}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic">{selectedAlert.summary}</p>
                </div>
                <div className="w-64 border-l border-slate-800 pl-8 h-full">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Orbital Sources</p>
                  <div className="space-y-1 overflow-y-auto max-h-24 custom-scrollbar">
                    {selectedAlert.sources?.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[9px] flex items-center justify-between gap-2 px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md hover:text-blue-400 transition-all truncate">
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800/50 rounded-xl">
                 <p className="text-xs font-bold uppercase tracking-widest opacity-40">SELECT TACTICAL MARKER FOR ANALYSIS</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6 flex flex-col min-h-0">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex-1 overflow-y-auto custom-scrollbar">
             <h4 className="text-slate-100 font-semibold mb-6 flex items-center gap-2">Risk Matrix</h4>
             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-slate-950 rounded-lg border border-red-500/30 text-center">
                  <p className="text-[10px] text-red-400 font-bold uppercase">Live</p>
                  <p className="text-2xl font-black text-slate-100">{activeAlerts.length}</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-amber-500/30 text-center">
                  <p className="text-[10px] text-amber-400 font-bold uppercase">Pred</p>
                  <p className="text-2xl font-black text-slate-100">{predictedAlerts.length}</p>
                </div>
             </div>
             <div className="space-y-2">
               {alerts.map(a => (
                 <div key={a.id} onClick={() => setSelectedAlert(a)} className={`text-xs p-3 rounded-lg border cursor-pointer ${selectedAlert?.id === a.id ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-950 border-slate-800'}`}>
                    <p className={`${a.isPrediction ? 'text-amber-500' : 'text-slate-100'} font-bold truncate`}>{a.location}</p>
                    <p className="text-slate-500 text-[9px] uppercase">{a.type}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeView;
