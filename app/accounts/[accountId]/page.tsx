import { notFound } from "next/navigation";

import ContactList from "@/app/contact-list";
import { fetchAccount, fetchContacts } from "@/lib/api";

interface AccountPageProps {
  params: {
    accountId: string;
  };
}

function safeWebsiteUrl(website: string | null): string | null {
  if (website === null) {
    return null;
  }

  try {
    const url = new URL(website);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
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
  const websiteUrl = safeWebsiteUrl(account.website);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>{account.name}</h1>
          <p>{account.industry ?? "Industry not set"}</p>
        </div>
        {websiteUrl ? (
          <a
            className="secondary-link"
            href={websiteUrl}
            rel="noopener noreferrer"
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
