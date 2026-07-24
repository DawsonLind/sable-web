export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Account {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  created_at: string;
}

export interface Contact {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  title: string | null;
  created_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isAccount(value: unknown): value is Account {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    isNullableString(value.industry) &&
    isNullableString(value.website) &&
    typeof value.created_at === "string"
  );
}

function isContact(value: unknown): value is Contact {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.account_id === "number" &&
    typeof value.first_name === "string" &&
    typeof value.last_name === "string" &&
    isNullableString(value.email) &&
    isNullableString(value.title) &&
    typeof value.created_at === "string"
  );
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }
  const body: unknown = await response.json();
  return body;
}

function parseList<T>(
  value: unknown,
  isItem: (item: unknown) => item is T,
  label: string,
): T[] {
  if (!Array.isArray(value) || !value.every(isItem)) {
    throw new Error(`API returned invalid ${label} data`);
  }
  return value;
}

export async function fetchAccounts(): Promise<Account[]> {
  return parseList(await fetchJson("/accounts"), isAccount, "account");
}

export async function fetchAccount(id: number): Promise<Account | null> {
  const response = await fetch(`${API_URL}/accounts/${id}`, {
    cache: "no-store",
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  const body: unknown = await response.json();
  if (!isAccount(body)) {
    throw new Error("API returned invalid account data");
  }
  return body;
}

export async function fetchContacts(accountId?: number): Promise<Contact[]> {
  const query = accountId === undefined ? "" : `?account_id=${accountId}`;
  return parseList(await fetchJson(`/contacts${query}`), isContact, "contact");
}
