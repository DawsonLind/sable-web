import {
  CalendarDays,
  Mail,
  Phone,
  StickyNote,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getAccounts, getActivities, getDeals } from "@/lib/api";
import {
  countByStage,
  DEAL_STAGES,
  DEAL_STAGE_LABELS,
  type Activity,
} from "@/lib/domain";
import { formatDate, formatUsd } from "@/lib/format";

const ACTIVITY_ICONS = {
  call: Phone,
  email: Mail,
  meeting: CalendarDays,
  note: StickyNote,
} satisfies Record<Activity["type"], LucideIcon>;

export default async function DashboardPage() {
  const [accounts, deals, activities] = await Promise.all([
    getAccounts(),
    getDeals(),
    getActivities(),
  ]);
  const counts = countByStage(deals);
  const accountNames = new Map(
    accounts.map((account) => [account.id, account.name]),
  );
  const activeDeals = deals.filter(
    (deal) => deal.stage !== "closed_won" && deal.stage !== "closed_lost",
  );
  const activePipeline = activeDeals.reduce(
    (total, deal) => total + deal.amount,
    0,
  );
  const recentActivities = [...activities]
    .sort(
      (left, right) =>
        new Date(right.occurred_at).getTime() -
        new Date(left.occurred_at).getTime(),
    )
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        description="A live view of your pipeline, accounts, and latest customer touchpoints."
        eyebrow="Overview"
        title="Good morning, Demo User"
      />

      <section
        aria-label="Sales summary"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-sm text-[var(--muted)]">Active pipeline</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {formatUsd(activePipeline)}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Across {activeDeals.length} open deals
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-sm text-[var(--muted)]">Accounts</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {accounts.length}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Active customer records
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-sm text-[var(--muted)]">Won deals</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {counts.closed_won}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Closed successfully
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/65">Win rate</p>
            <TrendingUp
              aria-hidden="true"
              className="text-teal-300"
              size={18}
            />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {counts.closed_won + counts.closed_lost === 0
              ? "0%"
              : `${Math.round(
                  (counts.closed_won /
                    (counts.closed_won + counts.closed_lost)) *
                    100,
                )}%`}
          </p>
          <p className="mt-1 text-xs text-white/45">Across closed deals</p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Pipeline by stage
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Opportunity volume across the full sales cycle.
              </p>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {DEAL_STAGES.map((stage) => (
              <div className="bg-white p-5" key={stage}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--muted)]">
                    {DEAL_STAGE_LABELS[stage]}
                  </span>
                  <span className="grid size-8 place-items-center rounded-full bg-[var(--bg)] text-sm font-semibold">
                    {counts[stage]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              The latest customer conversations and notes.
            </p>
          </div>
          {recentActivities.length === 0 ? (
            <EmptyState
              description="Customer touchpoints will appear here."
              title="No activity yet"
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
              {recentActivities.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.type];

                return (
                  <div
                    className="flex items-start gap-3 border-b border-[var(--line)] p-4 last:border-0"
                    key={activity.id}
                  >
                    <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                      <Icon aria-hidden="true" size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {activity.subject}
                      </p>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">
                        {activity.account_id
                          ? accountNames.get(activity.account_id)
                          : "General activity"}{" "}
                        · {formatDate(activity.occurred_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
