import { CheckCircle2, Database, UserRound } from "lucide-react";

import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Settings",
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        description="Configuration for this local Sable demo workspace."
        eyebrow="Workspace"
        title="Settings"
      />

      <div className="mt-8 max-w-3xl space-y-5">
        <section className="rounded-xl border border-[var(--line)] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
              <UserRound aria-hidden="true" size={19} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">Workspace profile</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                The demo uses a fixed local identity. No external sign-in is
                configured.
              </p>
              <dl className="mt-5 grid gap-4 border-t border-[var(--line)] pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                    User
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold">Demo User</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                    Email
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold">
                    demo@sable.dev
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--line)] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
              <Database aria-hidden="true" size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">API connection</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Sable reads live seeded data from the sibling FastAPI service.
              </p>
              <div className="mt-5 flex flex-col gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <code className="truncate rounded-md bg-[var(--bg)] px-3 py-2 text-xs text-[var(--muted)]">
                  {API_URL}
                </code>
                <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                  <CheckCircle2 aria-hidden="true" size={15} />
                  Configured
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
