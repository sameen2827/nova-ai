"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";

export function Cta() {
  return (
    <section id="cta" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-linear-to-br from-violet-600 via-fuchsia-600 to-cyan-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="size-7 text-white" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to build the future?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              Join thousands of developers shipping AI products with Nova. Start
              free — no credit card required.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink
                href="/chat"
                size="lg"
                className="h-12 w-full bg-white px-8 text-base text-violet-700 hover:bg-white/90 sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/dashboard"
                variant="outline"
                size="lg"
                className="h-12 w-full border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
              >
                Open Dashboard
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
