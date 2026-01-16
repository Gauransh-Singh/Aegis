
import React, { useState, useEffect } from 'react';
import { CloudNode } from '../types';

const InfrastructureMap: React.FC = () => {
  const [nodes, setNodes] = useState<CloudNode[]>([
    { id: '1', provider: 'GCP', region: 'us-central1', status: 'active', latency: 45 },
    { id: '2', provider: 'AWS', region: 'eu-west-1', status: 'active', latency: 120 },
    { id: '3', provider: 'Azure', region: 'eastus', status: 'standby', latency: 60 },
    { id: '4', provider: 'GCP', region: 'asia-east1', status: 'active', latency: 180 },
  ]);

  const [simulationActive, setSimulationActive] = useState(false);

  const triggerFailover = () => {
    setNodes(prev => prev.map(node => {
      if (node.provider === 'AWS') return { ...node, status: 'failed' };
      if (node.provider === 'Azure') return { ...node, status: 'active' };
      return node;
    }));
    setSimulationActive(true);
  };

  const reset = () => {
    setNodes([
      { id: '1', provider: 'GCP', region: 'us-central1', status: 'active', latency: 45 },
      { id: '2', provider: 'AWS', region: 'eu-west-1', status: 'active', latency: 120 },
      { id: '3', provider: 'Azure', region: 'eastus', status: 'standby', latency: 60 },
      { id: '4', provider: 'GCP', region: 'asia-east1', status: 'active', latency: 180 },
    ]);
    setSimulationActive(false);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-slate-900/50 p-8 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h4 className="text-slate-100 font-semibold flex items-center gap-2">
              <i className="fa-solid fa-network-wired text-blue-500"></i>
              Global DR Replication Graph
            </h4>
            <div className="flex gap-2">
               <button onClick={triggerFailover} className="bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600/30 transition-all">
                 Simulate Failure
               </button>
               <button onClick={reset} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all">
                 Reset State
               </button>
            </div>
          </div>

          <div className="relative h-[400px] flex items-center justify-center z-10">
            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full">
              <path d="M 200 200 L 600 200" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 400 100 L 400 300" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 200 200 L 400 100" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" />
            </svg>

            <div className="grid grid-cols-2 gap-32">
              {nodes.map((node) => (
                <div key={node.id} className="relative group">
                  <div className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-500 ${
                    node.status === 'active' ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20' :
                    node.status === 'standby' ? 'bg-slate-800/50 border-slate-600' :
                    'bg-red-950/20 border-red-600 animate-pulse'
                  }`}>
                    <i className={`fa-brands ${
                      node.provider === 'AWS' ? 'fa-aws' : 
                      node.provider === 'GCP' ? 'fa-google' : 'fa-microsoft'
                    } text-3xl`}></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{node.provider}</span>
                    <span className="text-xs text-slate-400 font-mono">{node.region}</span>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-2 -right-2 flex flex-col items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      node.status === 'active' ? 'bg-green-500 text-white' :
                      node.status === 'standby' ? 'bg-slate-500 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ 
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
            backgroundSize: '30px 30px',
            opacity: 0.2
          }}></div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
             <h4 className="text-slate-100 font-semibold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-green-500"></i>
                Node Health Metrics
             </h4>
             <div className="space-y-4">
               {nodes.map(node => (
                 <div key={node.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-bold text-slate-200">{node.provider} - {node.region}</span>
                       <span className={`text-xs ${node.status === 'failed' ? 'text-red-500' : 'text-slate-400'}`}>
                         Latency: {node.latency}ms
                       </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ${node.status === 'failed' ? 'w-0' : 'w-[85%] bg-blue-500'}`}
                       ></div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {simulationActive && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-amber-500 font-bold text-sm mb-1 flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                Failover Protocol Active
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Traffic successfully re-routed from AWS (EU-West-1) to Azure (EastUS) to maintain 99.9% availability during simulated regional outage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfrastructureMap;
