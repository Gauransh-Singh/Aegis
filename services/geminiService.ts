
import { GoogleGenAI, Type } from "@google/genai";
import { RiskLevel, Alert, AlertSource, SocialPost, LogisticsPlan, SatelliteReport, PreventionStrategy } from "../types";

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 5000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes('429');
    if (retries > 0 && isQuotaError) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function analyzeSatelliteImage(base64Data: string, mimeType: string): Promise<SatelliteReport> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this satellite image for natural disasters. Identify the type of disaster (Wildfire, Flood, Earthquake, Hurricane, or None), the risk level (Low, Medium, High, Critical), confidence score (0-1), a list of detected anomalies, and a technical summary. Return the response as JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disasterType: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            detectedAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
          },
          required: ["disasterType", "riskLevel", "confidence", "detectedAnomalies", "summary"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
}

export async function generateLogisticsPlan(alert: Alert): Promise<LogisticsPlan> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a tactical disaster response plan for a ${alert.type} in ${alert.location}. Coordinates: ${alert.coordinates.lat}, ${alert.coordinates.lng}. Return JSON with safeZones, hospitals (mock data), resourceNeeds, and tacticalAdvice.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safeZones: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, capacity: {type: Type.STRING}, status: {type: Type.STRING} } } },
            hospitals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, traumaLevel: {type: Type.STRING}, distance: {type: Type.STRING} } } },
            resourceNeeds: { type: Type.ARRAY, items: { type: Type.STRING } },
            tacticalAdvice: { type: Type.STRING }
          },
          required: ["safeZones", "hospitals", "resourceNeeds", "tacticalAdvice"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
}

export async function generateLiveMonitoringIncident(lat?: number, lng?: number): Promise<Alert> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview"; 
    const prompt = `Search for a major active natural disaster globally. Prioritize recent events near ${lat}, ${lng} if provided.`;

    const response = await ai.models.generateContent({
      model,
      contents: `${prompt} Return report with Type, Location, Severity, Summary, and Coords (Lat,Lng).`,
      config: { tools: [{ googleSearch: {} }] },
    });

    const text = response.text || "";
    const latMatch = text.match(/Lat:?\s*([-+]?\d*\.?\d+)/i);
    const lngMatch = text.match(/Lng:?\s*([-+]?\d*\.?\d+)/i);
    const typeMatch = text.match(/Type:?\s*([^\n,.]+)/i);
    const locMatch = text.match(/Location:?\s*([^\n,.]+)/i);
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: typeMatch ? typeMatch[1].trim() : "Regional Event",
      location: locMatch ? locMatch[1].trim() : "Sector Alpha",
      severity: text.toLowerCase().includes('critical') ? RiskLevel.CRITICAL : RiskLevel.HIGH,
      summary: text.split('Summary:')[1]?.trim().split('Coords:')[0] || text.substring(0, 300),
      isLive: true,
      coordinates: { 
        lat: latMatch ? parseFloat(latMatch[1]) : (lat || 0), 
        lng: lngMatch ? parseFloat(lngMatch[1]) : (lng || 0) 
      },
      sources: chunks.map((c: any) => c.web ? { uri: c.web.uri, title: c.web.title } : null).filter(Boolean) as AlertSource[]
    };
  });
}

export async function generatePredictions(): Promise<Alert[]> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Predict 3 likely disasters in next 72h. Return JSON array with type, location, severity, summary, lat, lng.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              location: { type: Type.STRING },
              severity: { type: Type.STRING },
              summary: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return (JSON.parse(response.text || "[]")).map((d: any) => ({
      ...d, id: 'pred-'+Math.random(), time: 'PREDICTED', isLive: false, isPrediction: true, coordinates: { lat: d.lat, lng: d.lng }
    }));
  });
}

export async function generateLiveSocialChatter(context: string): Promise<SocialPost[]> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 social posts reacting to: "${context}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { username: {type: Type.STRING}, text: {type: Type.STRING} } } }
      }
    });
    return (JSON.parse(response.text || "[]")).map((p: any) => ({
      ...p, id: Math.random().toString(), timeLabel: 'just now', isNew: true
    }));
  });
}

export async function analyzeSocialFeed(posts: string[]): Promise<any> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these posts: ${posts.join('\n')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            postCount: { type: Type.INTEGER },
            sentimentScore: { type: Type.NUMBER },
            trendingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            alertTriggered: { type: Type.BOOLEAN },
            rawTextAnalysis: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
}

/**
 * Generates a proactive disaster prevention strategy blueprint using AI reasoning.
 */
export async function generatePreventionStrategy(targetType: string, location: string): Promise<PreventionStrategy> {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a comprehensive proactive disaster prevention strategy for a ${targetType} scenario in ${location}. Include infrastructure hardening, community readiness, and specific emergency protocols. Return the strategy in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blueprintName: { type: Type.STRING, description: "Official name of the mitigation blueprint" },
            readinessScore: { type: Type.NUMBER, description: "Estimated percentage of current readiness" },
            checklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING, description: "Specific mitigation task" },
                  priority: { type: Type.STRING, description: "Priority level: High, Medium, or Low" }
                },
                required: ["task", "priority"]
              }
            },
            mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific steps for infrastructure mitigation" },
            evacuationProtocols: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clear steps for evacuation procedures" }
          },
          required: ["blueprintName", "readinessScore", "checklist", "mitigationSteps", "evacuationProtocols"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
}
