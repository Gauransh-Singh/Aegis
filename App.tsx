
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SatelliteAnalysis from './components/SatelliteAnalysis';
import SocialMonitor from './components/SocialMonitor';
import GlobeView from './components/GlobeView';
import LogisticsHub from './components/LogisticsHub';
import TimeMachine from './components/TimeMachine';
import { generateLiveMonitoringIncident, generateLiveSocialChatter, generatePredictions } from './services/geminiService';
import { Alert, RiskLevel, SocialPost, SocialInsight } from './types';

const SAMPLE_ALERTS: Alert[] = [
  {
    id: 'sample-1',
    time: '08:45 AM',
    type: 'Wildfire Risk',
    location: 'Ventura County, California',
    severity: RiskLevel.CRITICAL,
    summary: 'High-intensity heat signatures detected via multi-spectral scan. Secondary containment breaching. Strategic mitigation required for eastern perimeter to protect residential nodes.',
    isLive: true,
    coordinates: { lat: 34.2746, lng: -119.2290 },
    sources: [
      { uri: 'https://www.fire.ca.gov/', title: 'CalFire Incident Status' },
      { uri: 'https://twitter.com/VCFD', title: 'VCFD Alerts' }
    ]
  },
  {
    id: 'sample-2',
    time: '10:05 AM',
    type: 'Seismic Anomaly',
    location: 'Ishikawa Prefecture, Japan',
    severity: RiskLevel.HIGH,
    summary: 'M6.4 seismic pulse confirmed. Pre-disaster hardening protocols in effect for Noto Peninsula. Tsunami advisory active. Ground sensors indicate structural shifts in coastal grids.',
    isLive: true,
    coordinates: { lat: 37.3917, lng: 136.8986 },
    sources: [
      { uri: 'https://www.jma.go.jp/jma/indexe.html', title: 'JMA Seismic Monitor' }
    ]
  },
  {
    id: 'sample-3',
    time: '11:12 AM',
    type: 'Cyclone Tracking',
    location: 'Atlantic Basin Sector 4',
    severity: RiskLevel.MEDIUM,
    summary: 'Tropical Storm Arlene intensified. Eye formation visible in high-res orbital capture. Pre-emptive evacuation drills initiated for low-lying coastal zones.',
    isLive: true,
    coordinates: { lat: 25.0, lng: -75.0 },
    sources: [
      { uri: 'https://www.nhc.noaa.gov/', title: 'NHC Hurricane Tracker' }
    ]
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [socialInsight, setSocialInsight] = useState<SocialInsight | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => setUserLocation({lat: pos.coords.latitude, lng: pos.coords.longitude}));
    }
  }, []);

  const triggerSystemSync = useCallback(async () => {
    if (isScanning) return; 
    setIsScanning(true);
    setIsThrottled(false);
    try {
      const newIncident = await generateLiveMonitoringIncident(userLocation?.lat, userLocation?.lng);
      setAlerts(prev => [newIncident, ...prev.filter(a => !a.isPrediction && !a.id.startsWith('sample'))].slice(0, 15));
      
      await generateLiveSocialChatter(newIncident.summary).then(setSocialPosts);
      await generatePredictions().then(p => setAlerts(prev => [...prev, ...p]));
    } catch (err: any) {
      if (err?.status === 429) setIsThrottled(true);
      console.error("Sync failed:", err);
    } finally {
      setIsScanning(false);
    }
  }, [userLocation, isScanning]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard alerts={alerts} />;
      case 'satellite': return <SatelliteAnalysis />;
      case 'social': return <SocialMonitor posts={socialPosts} insight={socialInsight} isAnalyzing={false} isThrottled={isThrottled} />;
      case 'globe': return <GlobeView alerts={alerts} />;
      case 'response': return <LogisticsHub alerts={alerts.filter(a => !a.isPrediction)} />;
      case 'archives': return <TimeMachine />;
      default: return <Dashboard alerts={alerts} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} alertCount={alerts.filter(a => a.isLive).length} onSync={triggerSystemSync} isSyncing={isScanning} isThrottled={isThrottled}>
      {renderContent()}
    </Layout>
  );
};

export default App;
