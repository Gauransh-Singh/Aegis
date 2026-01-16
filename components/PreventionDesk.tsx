
import React, { useState } from 'react';
import { generatePreventionStrategy } from '../services/geminiService';
import { PreventionStrategy } from '../types';

const PreventionDesk: React.FC = () => {
  const [targetType, setTargetType] = useState('Wildfire');
  const [location, setLocation] = useState('Regional Perimeter');
  const [strategy, setStrategy] = useState<PreventionStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setStrategy(null);
    try {
      const result = await generatePreventionStrategy(targetType, location);
      setStrategy(result);
    } catch (error) {
      console.error("Strategy generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disasterTypes = ['Wildfire', 'Flood', 'Hurricane', 'Earthquake', 'Tsunami'];

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h4 className="text-slate-100 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <i className="fa-solid fa-person-shelter text-blue-500"></i>
            Mitigation Parameters
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Disaster Archetype</label>
              <div className="grid grid-cols-2 gap-2">
                {disasterTypes.map(t => (
                  <button 
                    key={t}
                    onClick={() => setTargetType(t)}
                    className={`py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                      targetType === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Location</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="City, Region, or Perimeter"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-blue-500/10"
            >
              {isLoading ? <><i className="fa-solid fa-atom animate-spin mr-2"></i> Processing...</> : 'Synthesize Blueprint'}
            </button>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-xl">
           <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
             <i className="fa-solid fa-lightbulb"></i> Proactive Insight
           </p>
           <p className="text-xs text-slate-400 leading-relaxed italic">
             "Early mitigation strategies reduce disaster impact costs by up to 70% in high-risk zones."
           </p>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 flex-1 relative overflow-hidden flex flex-col min-h-[600px]">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
              <i className="fa-solid fa-microchip animate-spin text-4xl text-blue-500"></i>
              <p className="text-xs uppercase font-black tracking-widest">Generating Mitigation Blueprint...</p>
            </div>
          ) : strategy ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start border-b border-slate-800 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{strategy.blueprintName}</h3>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">Status: Ready for Tactical Deployment</p>
                </div>
                <div className="text-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                      <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={220} strokeDashoffset={220 - (220 * strategy.readinessScore / 100)} className="text-emerald-500 transition-all duration-1000" />
                    </svg>
                    <span className="text-xl font-black text-slate-200">{strategy.readinessScore}%</span>
                  </div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Readiness Index</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-l-2 border-emerald-500 pl-3">Mandatory Checklist</h5>
                  <div className="space-y-2">
                    {strategy.checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-slate-700 transition-all">
                        <div className={`w-2 h-2 rounded-full ${item.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : item.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        <span className="text-xs text-slate-300 font-medium flex-1">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-l-2 border-blue-500 pl-3">Mitigation Procedures</h5>
                    <ul className="space-y-2">
                      {strategy.mitigationSteps.map((step, i) => (
                        <li key={i} className="text-xs text-slate-400 flex gap-2">
                          <span className="text-blue-500 font-bold">•</span> {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-l-2 border-amber-500 pl-3">Evacuation Protocols</h5>
                    <ul className="space-y-2">
                      {strategy.evacuationProtocols.map((step, i) => (
                        <li key={i} className="text-xs text-slate-400 flex gap-2">
                          <span className="text-amber-500 font-bold">➔</span> {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-12">
              <i className="fa-solid fa-shield-virus text-6xl mb-6 text-slate-700"></i>
              <h4 className="text-lg font-black uppercase tracking-widest mb-2">Standby for Prevention Synthesis</h4>
              <p className="text-xs leading-relaxed max-w-sm font-medium">Configure mitigation parameters to generate specialized AI readiness blueprints for high-risk sectors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreventionDesk;
