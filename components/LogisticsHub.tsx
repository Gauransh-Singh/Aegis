
import React, { useState } from 'react';
import { Alert, LogisticsPlan } from '../types';
import { generateLogisticsPlan } from '../services/geminiService';

interface LogisticsHubProps {
  alerts: Alert[];
}

const LogisticsHub: React.FC<LogisticsHubProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(alerts[0] || null);
  const [plan, setPlan] = useState<LogisticsPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!selectedAlert || isLoading) return;
    setIsLoading(true);
    setPlan(null); // Clear previous plan during new generation
    try {
      const result = await generateLogisticsPlan(selectedAlert);
      setPlan(result);
    } catch (error) {
      console.error("Logistics generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAlert = (a: Alert) => {
    setSelectedAlert(a);
    setPlan(null); // Reset plan view when switching targets
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <h4 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-map-location-dot text-blue-500"></i>
          Active Targets
        </h4>
        <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[600px]">
          {alerts.length > 0 ? alerts.map(a => (
            <button
              key={a.id}
              onClick={() => handleSelectAlert(a)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedAlert?.id === a.id ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-black uppercase text-blue-400">{a.type}</span>
                <span className="text-[9px] font-mono text-slate-500">{a.time}</span>
              </div>
              <p className="text-sm font-bold text-slate-100 truncate">{a.location}</p>
            </button>
          )) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl opacity-30">
              <p className="text-xs font-bold uppercase tracking-widest">No active data</p>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 min-h-[500px] flex flex-col relative overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
              <i className="fa-solid fa-microchip animate-spin text-4xl text-blue-500"></i>
              <p className="text-xs uppercase font-black tracking-widest">Synthesizing Tactical Response...</p>
            </div>
          ) : plan ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                    <i className="fa-solid fa-shield-heart text-emerald-500"></i> Safe Zones
                  </h5>
                  {plan.safeZones.map((sz, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <p className="text-sm font-bold text-slate-200">{sz.name}</p>
                      <div className="flex justify-between text-[10px] mt-1">
                        <span className="text-slate-500">Capacity: {sz.capacity}</span>
                        <span className="text-emerald-400 font-bold">{sz.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                    <i className="fa-solid fa-hospital text-red-500"></i> Medical Nodes
                  </h5>
                  {plan.hospitals.map((h, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <p className="text-sm font-bold text-slate-200">{h.name}</p>
                      <div className="flex justify-between text-[10px] mt-1">
                        <span className="text-slate-500">{h.traumaLevel}</span>
                        <span className="text-blue-400 font-bold">{h.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2 mb-4">Tactical Analysis</h5>
                <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl italic text-sm text-slate-300 leading-relaxed">
                  <i className="fa-solid fa-quote-left mr-2 opacity-30 text-blue-500"></i>
                  {plan.tacticalAdvice}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {plan.resourceNeeds.map((need, i) => (
                  <div key={i} className="bg-slate-800/50 p-3 rounded border border-slate-700 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{need}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedAlert ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-2 opacity-50">
                <i className="fa-solid fa-truck-fast text-6xl text-slate-700"></i>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Target Locked: {selectedAlert.location}</p>
              </div>
              <button 
                onClick={handleGeneratePlan}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-lg font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10"
              >
                Synthesize Tactical Response
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 px-12 text-center">
              <i className="fa-solid fa-satellite-dish text-6xl mb-4"></i>
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Awaiting global sync. Press "Refresh Intel" in header to discover targets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogisticsHub;
