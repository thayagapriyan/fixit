import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // Construct a chat history context if needed, but for simplicity in this stateless service wrapper,
    // we will mostly rely on the direct prompt or recreate a simple chat structure.
    // However, keeping it simple with generateContent for the "Assistant" persona.
    
    const systemInstruction = `
      You are FixItBot, an expert home improvement assistant for "FixItHub".
      Your goal is to help users identify household problems and suggest solutions.
      
      Categorize the user's problem into one of these: Electrical, Plumbing, Carpentry, General, or Other.
      
      If the problem seems simple (DIY), suggest specific tools they might need (like "Hammer", "Drill", "Multimeter").
      If the problem seems dangerous or complex (like main panel electrical work), strongly advise hiring a professional Service Person.
      
      Keep responses concise, friendly, and actionable. Use Markdown formatting.
    `;

    // We can use the chat API for better context management
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: prompt
    });

    return result.text || "I'm having trouble thinking of a solution right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently offline or experiencing high traffic. Please try again later.";
  }
};
