const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const getApiKey = (): string | null => {
  return process.env.GROQ_API_KEY || null;
};

export const generateVideoScript = async (
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GROQ_API_KEY 未配置，请在 .env.local 中设置');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `请求失败 (${response.status})`);
  }

  const data = await response.json();
  const text: string = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('模型未返回内容');
  return text;
};
