import { GoogleGenAI } from "@google/genai";
import { WeightEntry, AIInsight } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeWeightTrend = async (history: WeightEntry[]): Promise<AIInsight> => {
  const ai = getClient();
  if (!ai) {
    return {
      title: "喵？连不上网了...",
      content: "铲屎官，检查一下 API Key 还在不在？",
      type: "warning"
    };
  }

  const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const dataStr = sortedHistory.map(h => `${h.date}: ${h.weight}kg ${h.note ? `(${h.note})` : ''}`).join('\n');

  const prompt = `
    你是一只名叫“Mio”的猫咪健身教练。你说话非常可爱，每句话末尾喜欢加“喵~”，性格傲娇但很关心主人（用户）。
    
    请分析以下主人的体重记录：
    ${dataStr}

    1. 如果体重下降：夸奖主人，可以说“可以奖励一个小鱼干”之类的话。
    2. 如果体重上升或持平：温柔地蹭蹭主人，鼓励他多动动，或者少吃点零食。
    3. 语气要像猫一样慵懒、可爱、治愈。不要太严肃。
    
    请以 JSON 格式返回，不要 markdown 标记:
    {
      "title": "简短的猫语标题 (例如: '喵！瘦了耶！')",
      "content": "详细的猫语建议 (限 80 字以内)",
      "type": "encouragement" (或是 "warning", "tip")
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as AIInsight;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      title: "Mio 睡着了...",
      content: "呼噜呼噜...（AI 暂时没有响应，稍后再试喵）",
      type: "warning"
    };
  }
};

export const generateVisionQuote = async (topic: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "只要坚持，就会有猫的！";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `作为一只治愈系的猫咪，请写一句关于"${topic}"的简短励志语录（中文），不超过 25 个字，要像猫一样慵懒透彻，例如“晒晒太阳就好了”。`,
    });
    return response.text || "变得轻盈，像猫跳上围墙那样。";
  } catch (error) {
    return "每一天都是晒太阳的好日子喵。";
  }
};