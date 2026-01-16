
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Alert } from '../types';

interface VoiceBriefingProps {
  alerts: Alert[];
}

const VoiceBriefing: React.FC<VoiceBriefingProps> = ({ alerts }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startBriefing = async () => {
    if (isActive) {
      setIsActive(false);
      sessionRef.current?.close();
      return;
    }

    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const alertSummary = alerts.map(a => `${a.type} at ${a.location}. Severity: ${a.severity}. Details: ${a.summary}`).join("; ");
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
          },
          systemInstruction: `You are the Aegis Disaster Command AI Dispatcher. Provide a professional, concise, and calm situational awareness briefing. Use military-style terminology. Summarize the following alerts for the commander: ${alertSummary}. End the briefing with "End of report."`
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            console.log("Briefing link established.");
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const buffer = await decodeAudioData(decodeBase64(audioData), audioContextRef.current);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              source.start();
            }
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
          onerror: () => {
            setIsActive(false);
            setIsConnecting(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Briefing failure:", err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 transition-all relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 relative">
        {isActive ? (
          <div className="flex gap-1 items-center">
            <div className="w-1 h-4 bg-blue-500 animate-[bounce_1s_infinite_0ms]"></div>
            <div className="w-1 h-8 bg-blue-400 animate-[bounce_1s_infinite_200ms]"></div>
            <div className="w-1 h-5 bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
          </div>
        ) : (
          <i className={`fa-solid fa-headset text-2xl text-blue-400 ${isConnecting ? 'animate-pulse' : ''}`}></i>
        )}
      </div>

      <div className="text-center">
        <h5 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-1">Tactical Briefing</h5>
        <p className="text-[10px] text-slate-500 uppercase font-mono">
          {isActive ? 'Transmitting audio...' : isConnecting ? 'Establishing Link...' : 'AI Dispatcher Offline'}
        </p>
      </div>

      <button 
        onClick={startBriefing}
        disabled={isConnecting}
        className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
          isActive 
          ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' 
          : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
        }`}
      >
        {isActive ? 'Terminate Briefing' : 'Initialize Voice Link'}
      </button>

      {/* Background Pulse */}
      {isActive && (
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default VoiceBriefing;
