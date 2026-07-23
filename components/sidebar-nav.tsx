"use client";

import {
  Building2,
  ContactRound,
  Handshake,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Building2 },
  { href: "/contacts", label: "Contacts", icon: ContactRound },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className={compact ? "flex min-w-max gap-1" : "space-y-1"}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        const activeClasses = compact
          ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          : "bg-white/12 text-white";
        const inactiveClasses = compact
          ? "text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)]"
          : "text-white/60 hover:bg-white/7 hover:text-white";

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? activeClasses : inactiveClasses,
            ].join(" ")}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
