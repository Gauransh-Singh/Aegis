
import React, { useState } from 'react';
import { HistoricalEvent } from '../types';

const TimeMachine: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const historicalData: HistoricalEvent[] = [
    { id: '1', name: 'Great Fire Reconstruction', date: 'August 2023', type: 'Wildfire', description: 'Re-analyzing multi-spectral satellite heatmaps from the Maui Ridge event.' },
    { id: '2', name: 'Coastal Surge Archive', date: 'Sept 2022', type: 'Hurricane', description: 'Historical social sentiment analysis during landfall of Hurricane Ian.' },
    { id: '3', name: 'Seismic Legacy Data', date: 'Feb 2023', type: 'Earthquake', description: 'Synthetic playback of the Turkey-Syria earthquake response timeline.' }
  ];

  const runSimulation = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="p-8 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">System Data Archives</h3>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">Reconstruct historical disaster patterns to train response algorithms and compare current sensor data against verified past events.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {historicalData.map(event => (
          <div key={event.id} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
              <i className="fa-solid fa-clock-rotate-left text-blue-500 group-hover:rotate-[-360deg] transition-all duration-1000"></i>
            </div>
            <h4 className="text-lg font-bold text-slate-100 mb-2">{event.name}</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">{event.description}</p>
            <button 
              onClick={() => runSimulation(event)}
              className="w-full py-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
            >
              Initialize Reconstruction
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all ${isSimulating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="text-center space-y-6">
            <i className="fa-solid fa-atom text-6xl text-blue-500 animate-spin"></i>
            <div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Synthesizing Archive #{selectedEvent.id}</h2>
              <p className="text-blue-400 font-mono text-xs animate-pulse">UPDATING GLOBAL BUFFER WITH VERIFIED 2023 METADATA...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeMachine;
