"use client";

import { LogOut, Moon, Sun, Trash2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useTheme } from "@/components/theme-provider";
import { useLogout } from "@/hooks/use-logout";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { GROQ_MODELS } from "@/lib/groq-models";

export function SettingsInterface() {
  const router = useRouter();
  const logout = useLogout();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredModel, setPreferredModel] = useState("llama-3.3-70b-versatile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPreferredModel(user.preferredModel);
    }
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, preferredModel }),
      });
      if (res.ok) setMessage("Settings saved successfully.");
      else setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm("Clear all chat history? This cannot be undone.")) return;
    const res = await fetch("/api/user/clear-history", { method: "POST" });
    if (res.ok) setMessage("Chat history cleared.");
  };

  const deleteAccount = async () => {
    if (
      !confirm(
        "Delete your account permanently? All data will be lost. This cannot be undone.",
      )
    ) {
      return;
    }
    const res = await fetch("/api/user", { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  };

  const logoutAccount = () => logout();

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-border/50 px-4 sm:px-6">
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {message && (
              <p className="rounded-lg bg-muted px-4 py-2 text-sm text-foreground">
                {message}
              </p>
            )}

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Theme</p>
                    <p className="text-xs text-muted-foreground">
                      Switch between dark and light mode
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="size-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="size-4" />
                      Dark
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base">AI Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>Default model</Label>
                <Select
                  value={preferredModel}
                  onValueChange={(v) => v && setPreferredModel(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GROQ_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {GROQ_MODELS.find((m) => m.id === preferredModel)?.description}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                </div>
                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-linear-to-r from-violet-600 to-cyan-500 text-white"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base text-destructive">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Clear chat history</p>
                    <p className="text-xs text-muted-foreground">
                      Delete all conversations permanently
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    <Trash2 className="size-4" />
                    Clear
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Delete account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={deleteAccount}>
                    <UserX className="size-4" />
                    Delete
                  </Button>
                </div>
                <Separator />
                <Button variant="ghost" className="w-full" onClick={logoutAccount}>
                  <LogOut className="size-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
