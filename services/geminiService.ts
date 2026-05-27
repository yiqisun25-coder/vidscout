const SF_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const SF_MODEL = 'deepseek-ai/DeepSeek-V3';

const getApiKey = (): string | null => {
  return process.env.SILICONFLOW_API_KEY || null;
};

export const generateVideoScript = async (
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('SILICONFLOW_API_KEY 未配置，请在 .env.local 中设置');
  }

  const response = await fetch(SF_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: SF_MODEL,
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
    throw new Error(`api.siliconflow.cn ${response.status}: "${(err as any)?.message || '请求失败'}"`);
  }

  const data = await response.json();
  const text: string = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('模型未返回内容');
  return text;
};
