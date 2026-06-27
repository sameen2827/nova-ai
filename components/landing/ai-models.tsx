"use client";

import { motion } from "framer-motion";
import { Cpu, Gauge, Layers } from "lucide-react";

import { SectionHeader } from "@/components/landing/section-header";
import { Badge } from "@/components/ui/badge";
import { aiModels } from "@/lib/landing-data";

export function AiModels() {
  return (
    <section id="models" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="AI Models"
          title="Access the world's best models"
          description="Switch between models with a single parameter. Nova handles routing, fallbacks, and load balancing automatically."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {aiModels.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group flex items-center justify-between rounded-2xl p-5 transition-all hover:border-violet-500/30 sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-600/20 to-cyan-500/20">
                  <Cpu className="size-5 text-violet-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{model.name}</h3>
                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase"
                    >
                      {model.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.provider}</p>
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-foreground">
                  <Gauge className="size-3.5 text-cyan-500" />
                  {model.speed}
                </div>
                <div className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                  <Layers className="size-3" />
                  {model.context} context
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
