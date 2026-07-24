import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sable CRM",
  description: "A lightweight B2B sales CRM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          <header className="header">
            <Link className="brand" href="/">
              <span className="logo">S</span>
              <span>
                <span className="brand-name">Sable CRM</span>
                <span className="subtitle">Lightweight B2B sales pipeline</span>
              </span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/">Accounts</Link>
              <Link href="/contacts">Contacts</Link>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
