import {
  Bot,
  Brain,
  Code2,
  Globe,
  Lock,
  MessageSquare,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Models", href: "#models" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Brain,
    title: "Multi-Model Intelligence",
    description:
      "Route prompts to the best model automatically — from fast inference to deep reasoning.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Powered by Groq's LPU inference for sub-second responses at enterprise scale.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 ready infrastructure with end-to-end encryption and zero data retention options.",
  },
  {
    icon: Code2,
    title: "Developer First",
    description:
      "REST & SDK access, streaming responses, and webhooks that integrate in minutes.",
  },
  {
    icon: Globe,
    title: "Global Edge Network",
    description:
      "Low-latency delivery across 40+ regions with automatic failover and load balancing.",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description:
      "Build chatbots, copilots, and agents with memory, tools, and custom personas.",
  },
];

export const aiModels = [
  {
    name: "Llama 3.3 70B",
    provider: "Meta",
    speed: "Ultra Fast",
    context: "128K",
    badge: "Popular",
  },
  {
    name: "Mixtral 8x7B",
    provider: "Mistral",
    speed: "Fast",
    context: "32K",
    badge: "Efficient",
  },
  {
    name: "Gemma 2 9B",
    provider: "Google",
    speed: "Fast",
    context: "8K",
    badge: "Compact",
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    speed: "Reasoning",
    context: "64K",
    badge: "New",
  },
] as const;

export const whyChooseUs = [
  {
    icon: Sparkles,
    title: "Purpose-Built for AI",
    description:
      "Every layer — from API gateway to observability — is optimized for LLM workloads, not retrofitted from generic cloud tools.",
  },
  {
    icon: Bot,
    title: "Agent-Ready Platform",
    description:
      "Native tool calling, function schemas, and multi-step workflows so your agents can act, not just chat.",
  },
  {
    icon: Zap,
    title: "10× Faster Inference",
    description:
      "Groq-powered hardware delivers responses in milliseconds, keeping users engaged and costs predictable.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Nova AI cut our inference latency by 85%. Our support chatbot finally feels instant — customers notice the difference.",
    author: "Sarah Chen",
    role: "CTO, Flowstack",
    avatar: "SC",
  },
  {
    quote:
      "We migrated from OpenAI in a weekend. The API is familiar, the pricing is transparent, and the Groq speed is unreal.",
    author: "Marcus Rivera",
    role: "Lead Engineer, DataPulse",
    avatar: "MR",
  },
  {
    quote:
      "The multi-model routing alone saved us $12K/month. Nova picks the right model for each task automatically.",
    author: "Elena Volkov",
    role: "Founder, SynthLab",
    avatar: "EV",
  },
] as const;

export const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for side projects and experimentation.",
    features: [
      "10,000 tokens / month",
      "3 AI models",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 29,
    description: "For teams shipping AI features to production.",
    features: [
      "2M tokens / month",
      "All models + routing",
      "Priority support",
      "Advanced analytics",
      "Custom personas",
      "API rate limits: 100 req/min",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: null,
    description: "Custom scale, security, and dedicated support.",
    features: [
      "Unlimited tokens",
      "Dedicated infrastructure",
      "SSO & SAML",
      "SLA guarantee",
      "Custom model fine-tuning",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

export const faqs = [
  {
    question: "What AI models does Nova support?",
    answer:
      "Nova provides access to leading open-source models including Llama 3.3, Mixtral, Gemma 2, and DeepSeek R1 — all powered by Groq's ultra-fast inference. We continuously add new models as they become available.",
  },
  {
    question: "How does pricing work?",
    answer:
      "We offer a generous free tier for experimentation. Pro plans are billed monthly based on token usage with transparent per-token pricing. Enterprise customers receive custom pricing with volume discounts and dedicated infrastructure.",
  },
  {
    question: "Is my data used to train models?",
    answer:
      "Never. Your prompts and completions are never used to train models. Enterprise plans offer zero-retention mode where data is processed in-memory and immediately discarded.",
  },
  {
    question: "Can I migrate from OpenAI or Anthropic?",
    answer:
      "Yes. Nova's API is OpenAI-compatible, so migration is typically a one-line base URL change. Our migration guide and support team help you switch in under an hour.",
  },
  {
    question: "What uptime and SLAs do you offer?",
    answer:
      "Pro plans include 99.9% uptime. Enterprise plans come with a 99.99% SLA, dedicated support channels, and incident response within 15 minutes.",
  },
] as const;
