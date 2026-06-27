"use client";

import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Conversation = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
};

import { formatRelativeTime } from "@/lib/format";
export function RecentChats({
  conversations,
}: {
  conversations: Conversation[];
}) {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Recent Chats</CardTitle>
        <ButtonLink
          href="/chat"
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
        >
          View all
          <ArrowRight className="size-3.5" />
        </ButtonLink>
      </CardHeader>
      <CardContent className="space-y-1">
        {conversations.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No conversations yet. Start chatting!
          </p>
        )}
        {conversations.map((thread) => (
          <Link
            key={thread.id}
            href="/chat"
            className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/60"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
              <MessageSquare className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {thread.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {thread.preview}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(thread.updatedAt)}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
