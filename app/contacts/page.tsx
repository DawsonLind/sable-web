import { Mail } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getAccounts, getContacts } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Contacts",
};

export default async function ContactsPage() {
  const [accounts, contacts] = await Promise.all([
    getAccounts(),
    getContacts(),
  ]);
  const accountNames = new Map(
    accounts.map((account) => [account.id, account.name]),
  );

  return (
    <div>
      <PageHeader
        action={
          <span className="inline-flex w-fit rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
            {contacts.length} total
          </span>
        }
        description="People across every account, with the context needed for the next conversation."
        eyebrow="Workspace"
        title="Contacts"
      />

      <div className="mt-8">
        {contacts.length === 0 ? (
          <EmptyState
            description="New people will appear here when they are added."
            title="No contacts yet"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
            <table className="w-full min-w-180 border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-black/2 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Account</th>
                  <th className="px-5 py-3.5 font-semibold">Added</th>
                  <th className="w-12 px-5 py-3.5">
                    <span className="sr-only">Email</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    className="border-b border-[var(--line)] last:border-0 hover:bg-black/2"
                    key={contact.id}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                          {contact.first_name[0]}
                          {contact.last_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {contact.first_name} {contact.last_name}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--muted)]">
                            {contact.email ?? "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--muted)]">
                      {contact.title ?? "Not specified"}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <Link
                        className="font-medium hover:text-[var(--accent)]"
                        href={`/accounts/${contact.account_id}`}
                      >
                        {accountNames.get(contact.account_id) ??
                          "Unknown account"}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--muted)]">
                      {formatDate(contact.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      {contact.email ? (
                        <a
                          aria-label={`Email ${contact.first_name} ${contact.last_name}`}
                          className="grid size-8 place-items-center rounded-full text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)]"
                          href={`mailto:${contact.email}`}
                        >
                          <Mail aria-hidden="true" size={15} />
                        </a>
                      ) : null}
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
