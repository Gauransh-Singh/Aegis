
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface AlertSource {
  uri: string;
  title: string;
}

export interface Alert {
  id: string;
  time: string;
  type: string;
  location: string;
  severity: RiskLevel;
  summary: string;
  isLive: boolean;
  isPrediction?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  sources?: AlertSource[];
}

export interface SocialPost {
  id: string;
  username: string;
  text: string;
  timeLabel: string;
  isNew?: boolean;
}

export interface LogisticsPlan {
  safeZones: { name: string; capacity: string; status: string }[];
  hospitals: { name: string; traumaLevel: string; distance: string }[];
  resourceNeeds: string[];
  tacticalAdvice: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  date: string;
  type: string;
  description: string;
}

export interface SocialInsight {
  postCount: number;
  sentimentScore: number;
  trendingKeywords: string[];
  alertTriggered: boolean;
  rawTextAnalysis: string;
}

export enum DisasterType {
  WILDFIRE = 'Wildfire',
  FLOOD = 'Flood',
  EARTHQUAKE = 'Earthquake',
  HURRICANE = 'Hurricane',
  NONE = 'Normal/Baseline'
}

export interface SatelliteReport {
  disasterType: DisasterType;
  riskLevel: RiskLevel;
  confidence: number;
  detectedAnomalies: string[];
  summary: string;
}

export interface CloudNode {
  id: string;
  provider: 'GCP' | 'AWS' | 'Azure' | string;
  region: string;
  status: 'active' | 'standby' | 'failed' | string;
  latency: number;
}

/**
 * Strategy for preventing or mitigating disaster impact
 */
export interface PreventionStrategy {
  blueprintName: string;
  readinessScore: number;
  checklist: { task: string; priority: string }[];
  mitigationSteps: string[];
  evacuationProtocols: string[];
}
