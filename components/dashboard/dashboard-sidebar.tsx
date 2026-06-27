"use client";

import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/hooks/use-logout";
import { useUser } from "@/hooks/use-user";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard", label: "Usage", icon: Zap },
] as const;

type DashboardSidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const { user } = useUser();
  const profile = {
    name: user?.name ?? "User",
    avatar: getInitials(user?.name ?? "User"),
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 p-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-cyan-500 text-white">
              <Sparkles className="size-4" />
            </div>
            <span className="font-bold">
              Nova<span className="text-violet-500">AI</span>
            </span>
          </Link>
        )}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === pathname ||
            (item.label === "Overview" && pathname === "/dashboard");
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-3">
        <Link
          href="/settings"
          onClick={onMobileClose}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-violet-500/10 text-violet-600 dark:text-violet-300"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-2",
          )}
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && "Settings"}
        </Link>
      </div>

      <Separator />

      <div className={cn("flex items-center gap-3 p-4", collapsed && "justify-center")}>
        <Avatar className="size-9">
          <AvatarFallback className="bg-violet-500/20 text-xs font-semibold text-violet-600 dark:text-violet-300">
            {profile.avatar}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{profile.name}</p>
            <p className="truncate text-xs text-muted-foreground">Pro Plan</p>
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        )}
      </div>
      {collapsed && (
        <div className="flex justify-center gap-2 pb-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 lg:relative lg:z-auto",
          collapsed ? "w-[68px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {content}
      </aside>
    </>
  );
}
