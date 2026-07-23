import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getAccounts, getDeals } from "@/lib/api";
import { formatDate, formatUsd } from "@/lib/format";

export const metadata = {
  title: "Accounts",
};

export default async function AccountsPage() {
  const [accounts, deals] = await Promise.all([getAccounts(), getDeals()]);

  return (
    <div>
      <PageHeader
        action={
          <span className="inline-flex w-fit rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
            {accounts.length} total
          </span>
        }
        description="Companies in your sales pipeline, with opportunity value at a glance."
        eyebrow="Workspace"
        title="Accounts"
      />

      <div className="mt-8">
        {accounts.length === 0 ? (
          <EmptyState
            description="New company records will appear here."
            title="No accounts yet"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
            <table className="w-full min-w-180 border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-black/2 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  <th className="px-5 py-3.5 font-semibold">Account</th>
                  <th className="px-5 py-3.5 font-semibold">Industry</th>
                  <th className="px-5 py-3.5 font-semibold">Open deals</th>
                  <th className="px-5 py-3.5 font-semibold">Pipeline</th>
                  <th className="px-5 py-3.5 font-semibold">Added</th>
                  <th className="w-12 px-5 py-3.5">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const openDeals = deals.filter(
                    (deal) =>
                      deal.account_id === account.id &&
                      deal.stage !== "closed_won" &&
                      deal.stage !== "closed_lost",
                  );
                  const pipeline = openDeals.reduce(
                    (total, deal) => total + deal.amount,
                    0,
                  );

                  return (
                    <tr
                      className="border-b border-[var(--line)] last:border-0 hover:bg-black/2"
                      key={account.id}
                    >
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold hover:text-[var(--accent)]"
                          href={`/accounts/${account.id}`}
                        >
                          {account.name}
                        </Link>
                        {account.website ? (
                          <a
                            className="mt-1 block text-xs text-[var(--muted)] hover:text-[var(--accent)]"
                            href={account.website}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {new URL(account.website).hostname}
                          </a>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--muted)]">
                        {account.industry ?? "Not specified"}
                      </td>
                      <td className="px-5 py-4 text-sm">{openDeals.length}</td>
                      <td className="px-5 py-4 text-sm font-semibold">
                        {formatUsd(pipeline)}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--muted)]">
                        {formatDate(account.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          aria-label={`View ${account.name}`}
                          className="grid size-8 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                          href={`/accounts/${account.id}`}
                        >
                          <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
