"use client";

import { Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RecentChats } from "@/components/dashboard/recent-chats";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UsagePanel } from "@/components/dashboard/usage-panel";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

type DashboardData = {
  stats: {
    totalChats: number;
    totalMessages: number;
    tokensUsed: number;
    tokensLimit: number;
    avgResponseTime: number;
    activeModels: number;
  };
  recentConversations: {
    id: string;
    title: string;
    preview: string;
    updatedAt: string;
  }[];
  user: { name: string | null; email: string; avatar: string };
};

export function DashboardInterface() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    void fetch("/api/dashboard/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Welcome back, {data?.user.name?.split(" ")[0] ?? "there"}
              </p>
            </div>
          </div>
          <ButtonLink
            href="/chat"
            size="sm"
            className="bg-linear-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Chat</span>
          </ButtonLink>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            {data && <StatsCards stats={data.stats} />}
            {data && <UsagePanel stats={data.stats} />}
            {data && <RecentChats conversations={data.recentConversations} />}

            <div className="grid gap-4 sm:grid-cols-2">
              <QuickAction
                title="Start a new conversation"
                description="Chat with Nova AI using any of our supported models."
                href="/chat"
                cta="Open Chat"
              />
              <QuickAction
                title="Account settings"
                description="Manage your profile, model preferences, and account."
                href="/settings"
                cta="Settings"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <ButtonLink href={href} variant="outline" size="sm" className="mt-4">
        {cta}
      </ButtonLink>
    </div>
  );
}
