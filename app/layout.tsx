import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://nova-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nova AI — Premium AI Platform",
    template: "%s | Nova AI",
  },
  description:
    "Build AI products faster with Nova AI. Groq-powered chat, file uploads, enterprise security, and a developer-first experience.",
  keywords: [
    "AI",
    "SaaS",
    "LLM",
    "Groq",
    "chat",
    "file upload",
    "artificial intelligence",
  ],
  authors: [{ name: "Nova AI" }],
  openGraph: {
    title: "Nova AI — Premium AI Platform",
    description:
      "Groq-powered AI chat with PDF, Word, image, and text file support.",
    type: "website",
    locale: "en_US",
    siteName: "Nova AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova AI",
    description: "Premium AI chat platform powered by Groq",
  },
  robots: { index: true, follow: true },
};

const themeScript = `
  try {
    var t = localStorage.getItem('nova-theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
