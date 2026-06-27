"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { SectionHeader } from "@/components/landing/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { pricingPlans } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Pricing"
          title="Simple, transparent pricing"
          description="Start free, scale as you grow. No hidden fees, no surprise bills."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl p-6 sm:p-8",
                plan.highlighted
                  ? "border border-violet-500/50 bg-linear-to-b from-violet-500/10 to-cyan-500/5 shadow-xl shadow-violet-500/10"
                  : "glass-card",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-violet-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="#cta"
                variant={plan.highlighted ? "default" : "outline"}
                className={cn(
                  "w-full",
                  plan.highlighted &&
                    "bg-linear-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400",
                )}
              >
                {plan.cta}
              </ButtonLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
