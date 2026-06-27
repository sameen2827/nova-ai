"use client";

import {
  LayoutDashboard,
  LogOut,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatRelativeTime } from "@/lib/format";
import type { ChatThread } from "@/types";
import { useLogout } from "@/hooks/use-logout";

import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  threads: ChatThread[];
  activeThreadId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function ChatSidebar({
  threads,
  activeThreadId,
  searchQuery,
  onSearchChange,
  onNewChat,
  onSelectThread,
  onDeleteThread,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const logout = useLogout();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 p-3">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 px-1">
            <div className="flex size-7 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-cyan-500 text-white">
              <Sparkles className="size-3.5" />
            </div>
            <span className="text-sm font-bold">
              Nova<span className="text-violet-500">AI</span>
            </span>
          </Link>
        )}
        <div className="flex items-center gap-1">
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
      </div>

      <div className={cn("px-3", collapsed && "px-2")}>
        <Button
          onClick={() => {
            onNewChat();
            onMobileClose?.();
          }}
          className={cn(
            "w-full bg-linear-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400",
            collapsed && "size-9 px-0",
          )}
          size={collapsed ? "icon" : "default"}
        >
          <MessageSquarePlus className="size-4" />
          {!collapsed && "New Chat"}
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search chats…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="mt-3 min-h-0 flex-1 px-2">
            <div className="space-y-0.5 pb-3">
              {threads.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No chats found
                </p>
              )}
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-lg transition-colors",
                    activeThreadId === thread.id
                      ? "bg-muted"
                      : "hover:bg-muted/60",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectThread(thread.id);
                      onMobileClose?.();
                    }}
                    className="min-w-0 flex-1 px-3 py-2.5 text-left"
                  >
                    <p className="truncate text-sm font-medium text-foreground">
                      {thread.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatRelativeTime(thread.updatedAt)}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onDeleteThread(thread.id)}
                    className="mr-1 shrink-0 opacity-0 group-hover:opacity-100"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      <Separator className="mt-auto" />

      <div className={cn("flex items-center gap-1 p-3", collapsed && "flex-col")}>
        <ThemeToggle />
        {!collapsed && (
          <>
            <Link
              href="/dashboard"
              className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Dashboard"
            >
              <LayoutDashboard className="size-4" />
            </Link>
            <Link
              href="/settings"
              className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </Button>
          </>
        )}
      </div>
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
          collapsed ? "w-[60px]" : "w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
