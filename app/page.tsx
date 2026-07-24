import Link from "next/link";

import { fetchAccounts } from "@/lib/api";

export default async function Home() {
  const accounts = await fetchAccounts();

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Accounts</p>
          <h1>Customer accounts</h1>
          <p>Open an account to see the people connected to it.</p>
        </div>
        <Link className="secondary-link" href="/contacts">
          View all contacts
        </Link>
      </section>

      <section className="card">
        {accounts.length === 0 ? (
          <p className="empty">No accounts found.</p>
        ) : (
          <div className="account-grid">
            {accounts.map((account) => (
              <Link
                className="account-card"
                href={`/accounts/${account.id}`}
                key={account.id}
              >
                <span className="account-name">{account.name}</span>
                <span>{account.industry ?? "Industry not set"}</span>
                <span className="view-link">View account</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
