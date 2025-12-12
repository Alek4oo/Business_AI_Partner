import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FinancialDataPoint, RisksAndRoadmapData, ChatMessage } from "../types";

// For Vite, use import.meta.env with VITE_ prefix
const apiKey = (import.meta as any).env?.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a helpful, friendly AI assistant named ApexAI. 
You can help with any topic - business, coding, creative writing, general questions, or just casual conversation.

Communication style:
- Be conversational, warm, and helpful
- Give clear, structured answers when appropriate
- Be honest if you don't know something
- Use examples to explain complex topics
- Keep responses concise but informative

You have context about the user's business if they've set one up, but you're not limited to business topics.
Feel free to help with anything the user asks about.

Always respond in English.
`;

const MODEL_FAST = 'gemini-2.5-flash';
const MODEL_SMART = 'gemini-3-pro-preview';

export const generateIdeaValidation = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Analyze the business idea: "${profile.businessIdea}".
    Context: Capital $${profile.capital}, Experience: ${profile.experience}, Team: ${profile.teamSize} people.

    As a mentor, provide:
    1. Viability score (1-10) and why.
    2. "Reality Check" - what could go wrong most easily?
    3. Personal advice on whether to proceed.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Could not generate a response.";
};

export const generateMarketAnalysis = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Conduct a market analysis for: "${profile.businessIdea}" in the ${profile.location} region.
    Include:
    1. Who is the ideal customer (Avatar)?
    2. Who are the major players and where is your niche?
    3. What are the current trends?
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "No data available.";
};

export const generateBusinessPlan = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Create a structured business plan for: "${profile.businessIdea}".
    Team: ${profile.teamSize} people.
    
    Include:
    1. Value Proposition (Why will customers choose you?).
    2. Revenue Streams (All possible ways to earn).
    3. Operational plan for the first 3 months.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_SMART,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "No data available.";
};

export const generateFinancialForecast = async (profile: UserProfile): Promise<{ analysis: string, data: FinancialDataPoint[] }> => {
  const prompt = `
    Create a 6-month financial forecast for: "${profile.businessIdea}".
    Capital: $${profile.capital}. Spend it wisely.
    
    1. Brief budget analysis and when break-even will be reached.
    2. JSON data for revenue/expenses.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                expenses: { type: Type.NUMBER },
                profit: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  return { analysis: "Error generating forecast.", data: [] };
};

export const generateMarketingStrategy = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Suggest a marketing strategy for: "${profile.businessIdea}".
    Budget: ${profile.capital < 5000 ? 'Low (Guerilla Marketing)' : 'Moderate'}.
    
    Give me 3 specific campaigns I can launch tomorrow.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "No data available.";
};

export const checkLegalCompliance = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    What are the legal steps for: "${profile.businessIdea}" in ${profile.location}?
    Explain it simply, as if for a non-lawyer.
    1. Registration.
    2. Licenses.
    3. Accounting.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_SMART,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "No data available.";
};

export const generateRisksAndRoadmap = async (profile: UserProfile): Promise<RisksAndRoadmapData> => {
  const prompt = `
      For business "${profile.businessIdea}":
      Generate a JSON response containing:
      1. 'risks': A list of 3 main risks and how to minimize them (field 'mitigation').
      2. 'roadmap': A list of 6 specific tasks for the coming weeks. For each task include 'week' (number), 'title', 'detail' and 'isCompleted' (false).
    `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                mitigation: { type: Type.STRING }
              }
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                week: { type: Type.INTEGER },
                title: { type: Type.STRING },
                detail: { type: Type.STRING },
                isCompleted: { type: Type.BOOLEAN }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    const parsed = JSON.parse(response.text);
    // Ensure IDs exist
    parsed.roadmap = parsed.roadmap.map((item: any, index: number) => ({ ...item, id: index }));
    return parsed;
  }

  return { risks: [], roadmap: [] };
};

export const sendMentorMessage = async (profile: UserProfile, history: ChatMessage[], message: string): Promise<string> => {
  const context = `
      User: ${profile.name}.
      Business: ${profile.businessIdea}.
      Capital: $${profile.capital}, Team: ${profile.teamSize}.
      
      Chat History:
      ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
      
      User Message: ${message}
    `;

  const response = await ai.models.generateContent({
    model: MODEL_SMART,
    contents: context,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Sorry, I cannot respond at the moment.";
}