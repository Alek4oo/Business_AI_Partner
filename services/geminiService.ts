import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FinancialDataPoint, RisksAndRoadmapData, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || ''; // Ensure API key is available
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Ти си елитен AI Бизнес Ментор и Партньор. 
Твоята цел е не просто да даваш информация, а да водиш предприемача към успех.

Тон на комуникация:
- Емпатичен и мотивиращ ("Ти се справяш страхотно", "Това е смела стъпка").
- Реалистичен и честен (ако идеята е рискова, кажи го, но предложи решение).
- Структуриран и ясен.

Винаги взимай предвид ресурсите на потребителя (Капитал, Екип, Опит).
Ако капиталът е малък, предлагай "Bootstrap" стратегии.
Ако екипът е малък, фокус върху приоритетите.

Отговаряй винаги на Български език.
`;

const MODEL_FAST = 'gemini-2.5-flash';
const MODEL_SMART = 'gemini-3-pro-preview';

export const generateIdeaValidation = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Анализирай бизнес идеята: "${profile.businessIdea}".
    Контекст: Капитал ${profile.capital} лв., Опит: ${profile.experience}, Екип: ${profile.teamSize}.

    Като ментор, предостави:
    1. Оценка на жизнеспособността (1-10) и защо.
    2. "Reality Check" - какво може да се обърка най-лесно?
    3. Личен съвет дали да продължи.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Не можах да генерирам отговор.";
};

export const generateMarketAnalysis = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Направи пазарен анализ за: "${profile.businessIdea}" в регион ${profile.location}.
    Включи:
    1. Кой е идеалният клиент (Avatar)?
    2. Кои са големите играчи и къде е твоята ниша?
    3. Какви са тенденциите в момента?
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Няма данни.";
};

export const generateBusinessPlan = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Създай структуриран бизнес план за: "${profile.businessIdea}".
    Екип: ${profile.teamSize} души.
    
    Включи:
    1. Value Proposition (Защо клиентите ще изберат теб?).
    2. Revenue Streams (Всички възможни начини за печалба).
    3. Оперативен план за първите 3 месеца.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_SMART,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Няма данни.";
};

export const generateFinancialForecast = async (profile: UserProfile): Promise<{ analysis: string, data: FinancialDataPoint[] }> => {
  const prompt = `
    Създай финансова прогноза за 6 месеца за: "${profile.businessIdea}".
    Капитал: ${profile.capital} лв. Разходи го разумно.
    
    1. Кратък анализ на бюджета и кога ще се достигне Break-even.
    2. JSON данни за приходи/разходи.
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
  return { analysis: "Грешка при генериране.", data: [] };
};

export const generateMarketingStrategy = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Предложи маркетингова стратегия за: "${profile.businessIdea}".
    Бюджет: ${profile.capital < 5000 ? 'Нисък (Guerilla Marketing)' : 'Умерен'}.
    
    Дай ми 3 конкретни кампании, които мога да стартирам утре.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Няма данни.";
};

export const checkLegalCompliance = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    Какви са законовите стъпки за: "${profile.businessIdea}" в ${profile.location}?
    Обясни го просто, като за не-юрист.
    1. Регистрация.
    2. Лицензи.
    3. Счетоводство.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_SMART,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  return response.text || "Няма данни.";
};

export const generateRisksAndRoadmap = async (profile: UserProfile): Promise<RisksAndRoadmapData> => {
    const prompt = `
      За бизнес "${profile.businessIdea}":
      Генерирай JSON отговор съдържащ:
      1. 'risks': Списък с 3 основни риска и как да се минимизират (поле 'mitigation').
      2. 'roadmap': Списък от 6 конкретни задачи за следващите седмици. За всяка задача включи 'week' (число), 'title', 'detail' и 'isCompleted' (false).
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
      Потребител: ${profile.name}.
      Бизнес: ${profile.businessIdea}.
      Капитал: ${profile.capital}, Екип: ${profile.teamSize}.
      
      История на чата:
      ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
      
      User Message: ${message}
    `;

    const response = await ai.models.generateContent({
        model: MODEL_SMART,
        contents: context,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    return response.text || "Съжалявам, не мога да отговоря в момента.";
}