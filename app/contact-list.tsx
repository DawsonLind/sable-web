import Link from "next/link";

import type { Account, Contact } from "@/lib/api";

interface ContactListProps {
  accounts: Account[];
  contacts: Contact[];
  showAccount?: boolean;
}

export default function ContactList({
  accounts,
  contacts,
  showAccount = false,
}: ContactListProps) {
  const accountsById = new Map(accounts.map((account) => [account.id, account]));

  if (contacts.length === 0) {
    return <p className="empty">No contacts found.</p>;
  }

  return (
    <div className="entity-list">
      {contacts.map((contact) => {
        const account = accountsById.get(contact.account_id);

        return (
          <article className="entity-row" key={contact.id}>
            <div>
              <h3>
                {contact.first_name} {contact.last_name}
              </h3>
              <p>{contact.title ?? "Title not set"}</p>
            </div>
            <div className="entity-meta">
              {contact.email ? (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              ) : (
                <span>Email not set</span>
              )}
              {showAccount && account ? (
                <Link href={`/accounts/${account.id}`}>{account.name}</Link>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
