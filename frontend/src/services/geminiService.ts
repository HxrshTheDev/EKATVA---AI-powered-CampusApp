import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelId: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelId });
};

export const generateAIContent = async (prompt: string) => {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};
