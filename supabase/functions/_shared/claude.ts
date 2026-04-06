export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  text: string;
  tokens_used: number;
}

export async function callClaude(
  messages: ClaudeMessage[],
  systemPrompt: string,
  maxTokens: number = 2048
): Promise<ClaudeResponse> {
  const apiKey = Deno.env.get('GROQ_API_KEY');
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error ${response.status}: ${error.error?.message}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0].message.content,
    tokens_used: data.usage.total_tokens,
  };
}