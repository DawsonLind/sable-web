import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Mail,
  Phone,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StageBadge } from "@/components/stage-badge";
import {
  getAccount,
  getActivities,
  getContacts,
  getDeals,
} from "@/lib/api";
import type { Activity } from "@/lib/domain";
import { formatDate, formatUsd } from "@/lib/format";

const ACTIVITY_ICONS = {
  call: Phone,
  email: Mail,
  meeting: CalendarDays,
  note: StickyNote,
} satisfies Record<Activity["type"], LucideIcon>;

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accountId = Number(id);

  if (!Number.isInteger(accountId) || accountId < 1) {
    notFound();
  }

  const [account, contacts, allDeals, activities] = await Promise.all([
    getAccount(accountId),
    getContacts(accountId),
    getDeals(),
    getActivities(accountId),
  ]);
  const deals = allDeals.filter((deal) => deal.account_id === accountId);
  const dealValue = deals.reduce((total, deal) => total + deal.amount, 0);
  const timeline = [...activities].sort(
    (left, right) =>
      new Date(right.occurred_at).getTime() -
      new Date(left.occurred_at).getTime(),
  );

  return (
    <div>
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]"
        href="/accounts"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        All accounts
      </Link>

      <PageHeader
        action={
          account.website ? (
            <a
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3.5 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href={account.website}
              rel="noreferrer"
              target="_blank"
            >
              Visit website
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          ) : null
        }
        description={`${account.industry ?? "Industry not specified"} · Added ${formatDate(account.created_at)}`}
        eyebrow="Account"
        title={account.name}
      />

      <section
        aria-label="Account summary"
        className="mt-8 grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-[var(--line)] bg-white p-5">
          <p className="text-sm text-[var(--muted)]">Contacts</p>
          <p className="mt-2 text-2xl font-semibold">{contacts.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-5">
          <p className="text-sm text-[var(--muted)]">Deals</p>
          <p className="mt-2 text-2xl font-semibold">{deals.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--ink)] p-5 text-white">
          <p className="text-sm text-white/60">Total deal value</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatUsd(dealValue)}
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Contacts</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              People connected to this account.
            </p>
          </div>
          {contacts.length === 0 ? (
            <EmptyState
              description="Contacts for this account will appear here."
              title="No contacts"
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
              {contacts.map((contact) => (
                <div
                  className="flex items-center gap-3 border-b border-[var(--line)] p-4 last:border-0"
                  key={contact.id}
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                    {contact.first_name[0]}
                    {contact.last_name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {contact.first_name} {contact.last_name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                      {contact.title ?? "Title not specified"}
                    </p>
                  </div>
                  {contact.email ? (
                    <a
                      aria-label={`Email ${contact.first_name} ${contact.last_name}`}
                      className="ml-auto grid size-8 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)]"
                      href={`mailto:${contact.email}`}
                    >
                      <Mail aria-hidden="true" size={15} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Deals</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Opportunities linked to this account.
            </p>
          </div>
          {deals.length === 0 ? (
            <EmptyState
              description="Deals for this account will appear here."
              title="No deals"
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
              {deals.map((deal) => (
                <div
                  className="flex flex-col gap-3 border-b border-[var(--line)] p-4 last:border-0 sm:flex-row sm:items-center"
                  key={deal.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {deal.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                      {formatUsd(deal.amount)}
                    </p>
                  </div>
                  <div className="sm:ml-auto">
                    <StageBadge stage={deal.stage} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Timeline</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Calls, emails, meetings, and notes for {account.name}.
          </p>
        </div>
        {timeline.length === 0 ? (
          <EmptyState
            description="Account activity will appear here."
            title="No activity"
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
            {timeline.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];

              return (
                <article
                  className="grid gap-3 border-b border-[var(--line)] p-5 last:border-0 sm:grid-cols-[auto_1fr_auto]"
                  key={activity.id}
                >
                  <div className="grid size-9 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                    <Icon aria-hidden="true" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{activity.subject}</h3>
                    {activity.body ? (
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                        {activity.body}
                      </p>
                    ) : null}
                  </div>
                  <time
                    className="text-xs font-medium text-[var(--muted)]"
                    dateTime={activity.occurred_at}
                  >
                    {formatDate(activity.occurred_at)}
                  </time>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
