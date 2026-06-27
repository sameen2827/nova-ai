"use client";

import { motion } from "framer-motion";

import { SectionHeader } from "@/components/landing/section-header";
import { whyChooseUs } from "@/lib/landing-data";

export function WhyChooseUs() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <SectionHeader
                badge="Why Nova"
                title="Built different, built for speed"
                description="While others bolt AI onto legacy infrastructure, Nova was designed from the ground up for the unique demands of large language models."
                align="left"
                className="mb-8"
              />

              <div className="space-y-8">
                {whyChooseUs.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center bg-linear-to-br from-violet-600/10 via-fuchsia-500/5 to-cyan-500/10 p-8 sm:p-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-sm"
              >
                <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-violet-500/20 to-cyan-500/20 blur-2xl" />
                <div className="relative space-y-3 rounded-2xl border border-border/50 bg-background/80 p-6 backdrop-blur-xl">
                  {[
                    { label: "Inference Speed", value: 98, color: "from-violet-500 to-fuchsia-500" },
                    { label: "Cost Efficiency", value: 92, color: "from-fuchsia-500 to-cyan-500" },
                    { label: "Developer Experience", value: 96, color: "from-cyan-500 to-violet-500" },
                    { label: "Reliability", value: 99, color: "from-violet-500 to-cyan-500" },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-muted-foreground">{bar.label}</span>
                        <span className="font-medium text-foreground">{bar.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={`h-full rounded-full bg-linear-to-r ${bar.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bar.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
