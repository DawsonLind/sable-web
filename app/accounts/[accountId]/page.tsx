import { notFound } from "next/navigation";

import ContactList from "@/app/contact-list";
import { fetchAccount, fetchContacts } from "@/lib/api";

interface AccountPageProps {
  params: {
    accountId: string;
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const accountId = Number(params.accountId);
  if (!Number.isInteger(accountId) || accountId < 1) {
    notFound();
  }

  const [account, contacts] = await Promise.all([
    fetchAccount(accountId),
    fetchContacts(accountId),
  ]);
  if (account === null) {
    notFound();
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>{account.name}</h1>
          <p>{account.industry ?? "Industry not set"}</p>
        </div>
        {account.website ? (
          <a
            className="secondary-link"
            href={account.website}
            rel="noreferrer"
            target="_blank"
          >
            Visit website
          </a>
        ) : null}
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Contacts</p>
            <h2>People at {account.name}</h2>
          </div>
          <span className="count">{contacts.length}</span>
        </div>
        <ContactList accounts={[account]} contacts={contacts} />
      </section>
    </>
  );
}
