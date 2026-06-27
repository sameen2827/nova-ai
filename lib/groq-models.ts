export const GROQ_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    description: "Best for complex tasks and reasoning",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    description: "Ultra-fast for simple queries",
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Efficient multilingual model",
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Compact and capable",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill",
    description: "Advanced reasoning model",
  },
] as const;

export type GroqModelId = (typeof GROQ_MODELS)[number]["id"];

export const DEFAULT_GROQ_MODEL: GroqModelId = "llama-3.3-70b-versatile";

export function isValidGroqModel(model: string): model is GroqModelId {
  return GROQ_MODELS.some((m) => m.id === model);
}
