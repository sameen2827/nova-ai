"use client";

import { Cpu, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MODEL_USAGE = [
  { name: "Llama 3.3 70B", percent: 42, tokens: "54K" },
  { name: "Mixtral 8x7B", percent: 28, tokens: "36K" },
  { name: "Gemma 2 9B", percent: 18, tokens: "23K" },
  { name: "DeepSeek R1", percent: 12, tokens: "15K" },
];

const WEEKLY_USAGE = [45, 62, 38, 71, 55, 82, 68];

type Stats = {
  tokensUsed: number;
  tokensLimit: number;
};

export function UsagePanel({ stats }: { stats: Stats }) {
  const usagePercent = (stats.tokensUsed / stats.tokensLimit) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="size-4 text-violet-500" />
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly usage</span>
              <span className="font-medium text-foreground">
                {(stats.tokensUsed / 1000).toFixed(0)}K /{" "}
                {(stats.tokensLimit / 1_000_000).toFixed(0)}M
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-600 to-cyan-500 transition-all"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {usagePercent.toFixed(1)}% of your Pro plan limit used
            </p>
          </div>

          <div className="flex items-end justify-between gap-2 pt-2">
            {WEEKLY_USAGE.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-violet-500/20 transition-all hover:bg-violet-500/40"
                  style={{ height: `${val}px` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Cpu className="size-4 text-cyan-500" />
            Usage by Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MODEL_USAGE.map((model) => (
            <div key={model.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-foreground">{model.name}</span>
                <span className="text-muted-foreground">
                  {model.tokens} · {model.percent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-500"
                  style={{ width: `${model.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
