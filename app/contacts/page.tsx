import ContactList from "@/app/contact-list";
import { fetchAccounts, fetchContacts } from "@/lib/api";

export default async function ContactsPage() {
  const [accounts, contacts] = await Promise.all([
    fetchAccounts(),
    fetchContacts(),
  ]);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Contacts</p>
          <h1>People across every account</h1>
          <p>{contacts.length} contacts linked to {accounts.length} accounts.</p>
        </div>
      </section>

      <section className="card">
        <ContactList accounts={accounts} contacts={contacts} showAccount />
      </section>
    </>
  );
}
