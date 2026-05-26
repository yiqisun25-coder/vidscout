import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVideoScript = async (
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    throw new Error("API Key 未配置，请在 .env.local 中设置 API_KEY");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${systemPrompt}\n\n${userPrompt}`,
  });

  const text = response.text;
  if (!text) throw new Error("No response from model");
  return text;
};
