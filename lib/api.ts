export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  value: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LeadCreate {
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  value: number;
  notes: string;
}

export interface PipelineStats {
  total_leads: number;
  total_pipeline_value: number;
  won_value: number;
  by_status: Record<LeadStatus, number>;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchLeads(): Promise<Lead[]> {
  return handle<Lead[]>(await fetch(`${API_URL}/leads`, { cache: "no-store" }));
}

export async function fetchStats(): Promise<PipelineStats> {
  return handle<PipelineStats>(
    await fetch(`${API_URL}/stats`, { cache: "no-store" }),
  );
}

export async function createLead(payload: LeadCreate): Promise<Lead> {
  return handle<Lead>(
    await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateLead(
  id: number,
  payload: Partial<LeadCreate>,
): Promise<Lead> {
  return handle<Lead>(
    await fetch(`${API_URL}/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteLead(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/leads/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
}
