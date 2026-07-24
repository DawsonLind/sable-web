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
        <header className="site-header">
          <div className="site-header__inner">
            <Link
              className="brand"
              href="/"
              aria-label="Sable CRM dashboard"
            >
              <div className="logo">S</div>
              <div>
                <div className="brand-name">Sable CRM</div>
                <div className="subtitle">Lightweight B2B sales pipeline</div>
              </div>
            </Link>
            <nav className="primary-nav" aria-label="Primary navigation">
              <Link href="/">Dashboard</Link>
              <Link href="/deals/board">Pipeline</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
