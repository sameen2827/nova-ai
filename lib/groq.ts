import { getGroqApiKey } from "@/lib/groq-config";
import type { GroqModelId } from "@/lib/groq-models";

export type GroqChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function streamGroqChat({
  model,
  messages,
  signal,
}: {
  model: GroqModelId;
  messages: GroqChatMessage[];
  signal?: AbortSignal;
}) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Groq API error (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody) as {
        error?: { message?: string };
      };
      message = parsed.error?.message ?? message;
    } catch {
      if (errorBody) message = errorBody.slice(0, 200);
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("No response body from Groq");
  }

  return response.body;
}

export async function* parseGroqStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data) as {
            choices?: { delta?: { content?: string } }[];
          };
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          /* skip malformed chunks */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
