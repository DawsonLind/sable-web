import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { SidebarNav } from "@/components/sidebar-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[var(--sidebar)] px-5 py-6 text-white lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-lg bg-[var(--accent)]">
            <span className="text-sm font-bold">S</span>
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">Sable</p>
            <p className="text-xs text-white/45">Sales workspace</p>
          </div>
        </div>
        <div className="mt-9">
          <SidebarNav />
        </div>
        <div className="mt-auto rounded-xl border border-white/8 bg-white/5 p-4">
          <p className="text-xs font-medium text-white/80">Demo workspace</p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Seeded CRM data for local product demos.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:var(--bg)]/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="grid size-8 place-items-center rounded-lg bg-[var(--accent)] text-white">
                <span className="text-xs font-bold">S</span>
              </div>
              <span className="font-semibold">Sable</span>
            </div>

            <label className="relative ml-auto hidden w-full max-w-md sm:block lg:ml-0">
              <span className="sr-only">Search Sable</span>
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                size={17}
              />
              <input
                aria-label="Search Sable"
                className="h-10 w-full rounded-lg border border-[var(--line)] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-3 focus:ring-[color:var(--accent)]/10"
                placeholder="Search accounts, contacts, deals"
                readOnly
                type="search"
              />
            </label>

            <div className="ml-auto flex items-center gap-3 border-l border-[var(--line)] pl-4">
              <div className="grid size-8 place-items-center rounded-full bg-[var(--ink)] text-xs font-semibold text-white">
                DU
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">Demo User</p>
                <p className="text-xs text-[var(--muted)]">Administrator</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto border-t border-[var(--line)] px-4 py-2 lg:hidden">
            <SidebarNav compact />
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
