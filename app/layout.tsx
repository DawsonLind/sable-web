import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: "Sable CRM",
    template: "%s | Sable CRM",
  },
  description: "Pipeline clarity for modern sales teams.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geist.className} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
