
import React, { useState } from 'react';
import { analyzeSatelliteImage } from '../services/geminiService';
import { SatelliteReport, RiskLevel } from '../types';

const SatelliteAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingDemo, setIsFetchingDemo] = useState(false);
  const [report, setReport] = useState<SatelliteReport | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setReport(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoClick = async (url: string) => {
    setIsFetchingDemo(true);
    setReport(null);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsFetchingDemo(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to fetch demo image:", error);
      setIsFetchingDemo(false);
    }
  };

  const startAnalysis = async () => {
    if (!image || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const parts = image.split(',');
      const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const base64Data = parts[1];
      
      const result = await analyzeSatelliteImage(base64Data, mimeType);
      setReport(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Improved demo image IDs for topographical/satellite-like views
  const demoImages = [
    { name: 'Canyon Delta (Seismic)', url: 'https://picsum.photos/id/1016/800/400' },
    { name: 'Forest Grid (Thermal)', url: 'https://picsum.photos/id/1021/800/400' },
    { name: 'Basin Surge (Flooding)', url: 'https://picsum.photos/id/1015/800/400' }
  ];

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h4 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-camera-retro text-blue-500"></i>
            Active Satellite Capture
          </h4>
          
          <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center group">
            {isFetchingDemo ? (
              <div className="text-center">
                <i className="fa-solid fa-cloud-arrow-down text-4xl text-blue-500 animate-bounce mb-4"></i>
                <p className="text-slate-400 font-mono text-xs">DOWNLOADING HIGH-RES IMAGERY...</p>
              </div>
            ) : image ? (
              <img src={image} className="w-full h-full object-cover" alt="Satellite capture" />
            ) : (
              <div className="text-center p-12">
                <i className="fa-solid fa-upload text-4xl text-slate-800 mb-4"></i>
                <p className="text-slate-500 text-sm mb-4">UPLINK SPECTRAL DATA</p>
                <div className="relative">
                  <button className="bg-slate-800 px-4 py-2 rounded border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-all">Browse Files</button>
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </div>
            )}
            
            {image && !isFetchingDemo && (
              <button 
                onClick={() => { setImage(null); setReport(null); }}
                className="absolute top-4 right-4 bg-red-500/80 p-2 rounded-full hover:bg-red-500 transition-colors z-10"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={startAnalysis}
                disabled={!image || isAnalyzing || isFetchingDemo}
                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all border ${
                  isAnalyzing 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' 
                  : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {isAnalyzing ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    SYNTHESIZING...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-microchip"></i>
                    INITIATE AI SCAN
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 font-mono">SENSOR: MULTIMODAL GEMINI-3</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {demoImages.map((demo, idx) => (
            <button 
              key={idx}
              disabled={isFetchingDemo || isAnalyzing}
              onClick={() => handleDemoClick(demo.url)}
              className="bg-slate-900/50 p-2 rounded-lg border border-slate-800 hover:border-blue-500/50 disabled:opacity-50 transition-all text-left overflow-hidden group"
            >
              <img src={demo.url} className="h-20 w-full object-cover rounded mb-2 grayscale group-hover:grayscale-0 transition-all" alt={demo.name} />
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{demo.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-full flex flex-col">
          <h4 className="text-slate-100 font-semibold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-file-waveform text-green-500"></i>
            AI Detection Report
          </h4>

          {report ? (
            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Classification</p>
                  <p className={`text-xl font-black ${
                    report.riskLevel === RiskLevel.CRITICAL ? 'text-red-500' : 
                    report.riskLevel === RiskLevel.HIGH ? 'text-orange-500' : 'text-blue-400'
                  }`}>
                    {report.disasterType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Confidence</p>
                  <p className="text-xl font-mono text-slate-200">{(report.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Detected Anomalies</p>
                <div className="flex flex-wrap gap-2">
                  {report.detectedAnomalies.map((a, i) => (
                    <span key={i} className="bg-slate-800 border border-slate-700 px-3 py-1 rounded text-[10px] text-slate-300 font-bold uppercase">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Technical Summary</p>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 italic">
                  "{report.summary}"
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Escalate Incident
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 px-8">
              <i className="fa-solid fa-satellite-dish text-6xl mb-4 text-slate-700"></i>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">System in Standby. Upload imagery to begin analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SatelliteAnalysis;
