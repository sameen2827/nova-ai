"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "10M+", label: "API Calls / Day" },
  { value: "<100ms", label: "Avg Latency" },
  { value: "99.9%", label: "Uptime SLA" },
];

export function Hero() {
  return (
    <section className="relative px-4 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge
            variant="outline"
            className="mb-6 border-violet-500/30 bg-violet-500/10 px-3 py-1 text-violet-600 dark:text-violet-300"
          >
            <Star className="size-3 fill-violet-500 text-violet-500" />
            Powered by Groq · Now in Public Beta
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Build AI products{" "}
            <span className="bg-linear-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              10× faster
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Nova AI is the premium platform for deploying large language models
            at blazing speed. One API, every model, enterprise-grade security.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href="/chat"
              size="lg"
              className="h-12 w-full bg-linear-to-r from-violet-600 to-cyan-500 px-8 text-base text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-cyan-400 sm:w-auto"
            >
              Start Building Free
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="#features"
              variant="outline"
              size="lg"
              className="h-12 w-full border-border/60 bg-background/50 px-8 text-base backdrop-blur-sm sm:w-auto"
            >
              <Play className="size-4" />
              See How It Works
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="glass-card overflow-hidden rounded-2xl p-1 shadow-2xl shadow-violet-500/10">
            <div className="rounded-xl bg-muted/30 p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-400" />
                <div className="size-3 rounded-full bg-amber-400" />
                <div className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-muted-foreground">
                  nova-ai-terminal
                </span>
              </div>
              <pre className="overflow-x-auto text-left text-xs leading-relaxed text-muted-foreground sm:text-sm">
                <code>
                  <span className="text-violet-500">$</span> curl api.nova.ai/v1/chat{" "}
                  {"\n"}
                  {"  "}-H <span className="text-cyan-500">&quot;Authorization: Bearer nv_•••&quot;</span>{" "}
                  {"\n"}
                  {"  "}-d <span className="text-emerald-500">&apos;{`{"model":"llama-3.3-70b","messages":[{"role":"user","content":"Hello Nova!"}]}`}&apos;</span>
                  {"\n"}
                  {"\n"}
                  <span className="text-foreground">{`{ "choices": [{ "message": { "content": "Hello! How can I help you today?" } }], "latency_ms": 47 }`}</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 sm:max-w-none sm:gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
