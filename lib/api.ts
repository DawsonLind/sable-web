import { z, type ZodType } from "zod";

import {
  accountSchema,
  activitySchema,
  contactSchema,
  dealSchema,
  type Account,
  type Activity,
  type Contact,
  type Deal,
  type DealStage,
} from "@/lib/domain";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

async function request<T>(path: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Sable API request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  return schema.parse(payload);
}

export function getAccounts(): Promise<Account[]> {
  return request("/accounts", z.array(accountSchema));
}

export function getAccount(accountId: number): Promise<Account> {
  return request(`/accounts/${accountId}`, accountSchema);
}

export function getContacts(accountId?: number): Promise<Contact[]> {
  const query = accountId === undefined ? "" : `?account_id=${accountId}`;
  return request(`/contacts${query}`, z.array(contactSchema));
}

export function getDeals(stage?: DealStage): Promise<Deal[]> {
  const query = stage === undefined ? "" : `?stage=${stage}`;
  return request(`/deals${query}`, z.array(dealSchema));
}

export function getActivities(accountId?: number): Promise<Activity[]> {
  const query = accountId === undefined ? "" : `?account_id=${accountId}`;
  return request(`/activities${query}`, z.array(activitySchema));
}
