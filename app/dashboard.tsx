"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createLead,
  deleteLead,
  fetchLeads,
  fetchStats,
  type Lead,
  type LeadStatus,
  type PipelineStats,
} from "@/lib/api";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const emptyForm = {
  name: "",
  company: "",
  email: "",
  status: "new" as LeadStatus,
  value: "",
  notes: "",
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [leadsData, statsData] = await Promise.all([
        fetchLeads(),
        fetchStats(),
      ]);
      setLeads(leadsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createLead({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        status: form.status,
        value: form.value ? Number(form.value) : 0,
        notes: form.notes.trim(),
      });
      setForm(emptyForm);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteLead(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead");
    }
  };

  const statCards = useMemo(
    () => [
      { label: "Total Leads", value: stats ? String(stats.total_leads) : "-" },
      {
        label: "Pipeline Value",
        value: stats ? currency.format(stats.total_pipeline_value) : "-",
      },
      {
        label: "Won Value",
        value: stats ? currency.format(stats.won_value) : "-",
      },
      {
        label: "Qualified",
        value: stats ? String(stats.by_status.qualified) : "-",
      },
    ],
    [stats],
  );

  return (
    <>
      {error && <div className="error">{error}</div>}

      <section className="stats">
        {statCards.map((card) => (
          <div className="stat" key={card.label}>
            <div className="label">{card.label}</div>
            <div className="value">{card.value}</div>
          </div>
        ))}
      </section>

      <div className="grid">
        <section className="card">
          <h2>Leads</h2>
          {loading ? (
            <div className="empty">Loading…</div>
          ) : leads.length === 0 ? (
            <div className="empty">No leads yet. Add your first one.</div>
          ) : (
            leads.map((lead) => (
              <div className="lead" key={lead.id}>
                <div className="who">
                  <span className="name">{lead.name}</span>
                  <span className="company">
                    {lead.company} · {lead.email}
                  </span>
                </div>
                <div className="right">
                  <span className="value">{currency.format(lead.value)}</span>
                  <span className={`badge ${lead.status}`}>{lead.status}</span>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(lead.id)}
                    aria-label={`Delete ${lead.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="card">
          <h2>New Lead</h2>
          <form onSubmit={onSubmit}>
            <label>
              Contact name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </label>
            <label>
              Company
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Acme Inc."
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@acme.com"
              />
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as LeadStatus })
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Deal value (USD)
              <input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="10000"
              />
            </label>
            <label>
              Notes
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Context about this lead"
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add lead"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
