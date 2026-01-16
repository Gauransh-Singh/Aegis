
import React from 'react';
import { SocialInsight, SocialPost } from '../types';

interface SocialMonitorProps {
  posts: SocialPost[];
  insight: SocialInsight | null;
  isAnalyzing: boolean;
  isThrottled?: boolean;
}

const SocialMonitor: React.FC<SocialMonitorProps> = ({ posts, insight, isAnalyzing, isThrottled }) => {
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-slate-100 font-semibold flex items-center gap-2">
              <i className="fa-solid fa-bullhorn text-amber-500"></i>
              Public Intelligence Stream
            </h4>
            <div className="flex items-center gap-3">
              {isThrottled && (
                <div className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 animate-pulse">
                  QUOTA RECOVERY ACTIVE
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                UPLINK ACTIVE
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6 flex-1 overflow-hidden flex flex-col">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Verified Disaster Chatter</span>
              {isAnalyzing && (
                <span className="flex items-center gap-2 text-blue-400">
                  <i className="fa-solid fa-microchip animate-spin"></i>
                  PARSING SIGNAL...
                </span>
              )}
            </p>
            <div className="bg-slate-950/50 rounded-lg border border-slate-800 divide-y divide-slate-800/50 overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
              {posts.map((post) => (
                <div key={post.id} className={`p-4 flex gap-4 hover:bg-slate-900/50 transition-all duration-700 ${post.isNew ? 'bg-blue-500/5' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800 flex-shrink-0">
                    <i className="fa-solid fa-user text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-bold text-slate-300">@{post.username}</span>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">{post.timeLabel}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{post.text}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-[9px] text-slate-600 flex items-center gap-1"><i className="fa-regular fa-comment"></i> 12</span>
                      <span className="text-[9px] text-slate-600 flex items-center gap-1"><i className="fa-solid fa-retweet"></i> 4</span>
                      <span className="text-[9px] text-slate-600 flex items-center gap-1"><i className="fa-regular fa-heart"></i> 29</span>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 p-12 text-center">
                   <div className="relative mb-6">
                     <i className="fa-solid fa-satellite-dish text-5xl opacity-10"></i>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <i className="fa-solid fa-magnifying-glass text-xl text-blue-500/40 animate-pulse"></i>
                     </div>
                   </div>
                   <p className="text-sm font-medium italic mb-1">Scanning Global Frequencies</p>
                   <p className="text-[10px] uppercase tracking-widest opacity-40">Waiting for verified incident context...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex-1">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-slate-100 font-semibold flex items-center gap-2">
                <i className="fa-solid fa-brain text-purple-500"></i>
                NLP Analysis
              </h4>
              <span className="text-[10px] text-slate-500 font-mono border border-slate-800 px-2 py-1 rounded">GEMINI-3 FLASH</span>
           </div>

          {insight ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">Sentiment</p>
                   <p className={`text-3xl font-black transition-colors ${insight.sentimentScore < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                     {(insight.sentimentScore * 100).toFixed(0)}%
                   </p>
                   <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-1000" style={{ width: `${Math.abs(insight.sentimentScore * 100)}%` }}></div>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center">
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2">Panic Index</p>
                   <p className={`text-3xl font-black ${insight.alertTriggered ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}>
                     {insight.alertTriggered ? 'HIGH' : 'LOW'}
                   </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-hashtag text-blue-500"></i>
                  Signal Markers
                </p>
                <div className="flex flex-wrap gap-2">
                  {insight.trendingKeywords.map((tag, i) => (
                    <span key={i} className="bg-blue-500/5 text-blue-400 px-3 py-1.5 rounded-lg text-[10px] font-black border border-blue-500/20 hover:border-blue-400 transition-all cursor-default">
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Situation Report</p>
                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 text-sm text-slate-400 leading-relaxed italic relative">
                  <i className="fa-solid fa-quote-left absolute -top-3 -left-2 text-slate-800 text-3xl opacity-50"></i>
                  {insight.rawTextAnalysis}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
              <i className="fa-solid fa-dna text-6xl mb-6 text-slate-800 animate-pulse"></i>
              <p className="text-xs font-bold uppercase tracking-widest max-w-[220px]">Awaiting signal packets for semantic synthesis...</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-purple-600/5 border border-purple-500/20 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
            <i className="fa-solid fa-tower-broadcast"></i>
          </div>
          <div className="flex-1">
             <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Cross-Channel Logic</p>
             <p className="text-[9px] text-slate-500">Integrating social metadata with orbital heatmaps for 98% detection accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMonitor;
