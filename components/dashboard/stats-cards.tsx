import {
  Clock,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Stats = {
  totalChats: number;
  totalMessages: number;
  tokensUsed: number;
  tokensLimit: number;
  avgResponseTime: number;
  activeModels: number;
};

export function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "Total Chats",
      value: stats.totalChats.toString(),
      change: "All time",
      icon: MessageSquare,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Messages Sent",
      value: stats.totalMessages.toString(),
      change: "All time",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "AI Usage",
      value: `${((stats.tokensUsed / stats.tokensLimit) * 100).toFixed(1)}%`,
      sub: `${(stats.tokensUsed / 1000).toFixed(0)}K tokens`,
      change: `of ${(stats.tokensLimit / 1_000_000).toFixed(0)}M limit`,
      icon: Zap,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Avg Response",
      value: `${stats.avgResponseTime}ms`,
      change: "Groq powered",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((stat) => (
        <Card
          key={stat.label}
          className="glass-card overflow-hidden border-border/50"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-lg bg-linear-to-br text-white",
                stat.color,
              )}
            >
              <stat.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            {stat.sub && (
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            )}
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="size-3" />
              {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
