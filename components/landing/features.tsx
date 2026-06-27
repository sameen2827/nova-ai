"use client";

import { motion } from "framer-motion";

import { SectionHeader } from "@/components/landing/section-header";
import { features } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Features"
          title="Everything you need to ship AI"
          description="From prototype to production — Nova gives you the tools, speed, and reliability to build world-class AI experiences."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn(
                "glass-card group rounded-2xl p-6 transition-all duration-300",
                "hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5",
              )}
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-cyan-500/20 text-violet-600 transition-colors group-hover:from-violet-500/30 group-hover:to-cyan-500/30 dark:text-violet-300">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
