import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StageBadge } from "@/components/stage-badge";
import { getAccounts, getDeals } from "@/lib/api";
import { countByStage } from "@/lib/domain";
import { formatDate, formatUsd } from "@/lib/format";

export const metadata = {
  title: "Deals",
};

export default async function DealsPage() {
  const [accounts, deals] = await Promise.all([getAccounts(), getDeals()]);
  const accountNames = new Map(
    accounts.map((account) => [account.id, account.name]),
  );
  const stageCounts = countByStage(deals);
  const totalValue = deals.reduce((total, deal) => total + deal.amount, 0);
  const averageValue = deals.length === 0 ? 0 : totalValue / deals.length;

  return (
    <div>
      <PageHeader
        action={
          <span className="inline-flex w-fit rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
            {deals.length} total
          </span>
        }
        description="Every opportunity in one focused view, from first conversation to close."
        eyebrow="Pipeline"
        title="Deals"
      />

      <section
        aria-label="Deal summary"
        className="mt-8 grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-[var(--line)] bg-white p-5">
          <p className="text-sm text-[var(--muted)]">Total value</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {formatUsd(totalValue)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-5">
          <p className="text-sm text-[var(--muted)]">Average deal</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {formatUsd(averageValue)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-5 text-white">
          <p className="text-sm text-white/60">Closed won</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {stageCounts.closed_won}
          </p>
        </div>
      </section>

      <div className="mt-6">
        {deals.length === 0 ? (
          <EmptyState
            description="New opportunities will appear here."
            title="No deals yet"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
            <table className="w-full min-w-200 border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-black/2 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  <th className="px-5 py-3.5 font-semibold">Deal</th>
                  <th className="px-5 py-3.5 font-semibold">Account</th>
                  <th className="px-5 py-3.5 font-semibold">Stage</th>
                  <th className="px-5 py-3.5 text-right font-semibold">
                    Value
                  </th>
                  <th className="px-5 py-3.5 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr
                    className="border-b border-[var(--line)] last:border-0 hover:bg-black/2"
                    key={deal.id}
                  >
                    <td className="px-5 py-4 text-sm font-semibold">
                      {deal.name}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <Link
                        className="text-[var(--muted)] hover:text-[var(--accent)]"
                        href={`/accounts/${deal.account_id}`}
                      >
                        {accountNames.get(deal.account_id) ?? "Unknown account"}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <StageBadge stage={deal.stage} />
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums">
                      {formatUsd(deal.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--muted)]">
                      {formatDate(deal.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
