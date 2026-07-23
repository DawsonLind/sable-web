import { z } from "zod";

export const DEAL_STAGES = [
  "prospecting",
  "qualified",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
] as const;

export const dealStageSchema = z.enum(DEAL_STAGES);
export type DealStage = z.infer<typeof dealStageSchema>;

export const DEAL_STAGE_LABELS = {
  prospecting: "Prospecting",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed won",
  closed_lost: "Closed lost",
} satisfies Record<DealStage, string>;

const timestampSchema = z.iso.datetime({ local: true });

export const accountSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  industry: z.string().nullable(),
  website: z.url().nullable(),
  created_at: timestampSchema,
});

export type Account = z.infer<typeof accountSchema>;

export const contactSchema = z.object({
  id: z.number().int(),
  account_id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email().nullable(),
  title: z.string().nullable(),
  created_at: timestampSchema,
});

export type Contact = z.infer<typeof contactSchema>;

export const dealSchema = z.object({
  id: z.number().int(),
  account_id: z.number().int(),
  name: z.string(),
  amount: z.number(),
  stage: dealStageSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Deal = z.infer<typeof dealSchema>;

export const activitySchema = z.object({
  id: z.number().int(),
  account_id: z.number().int().nullable(),
  contact_id: z.number().int().nullable(),
  deal_id: z.number().int().nullable(),
  type: z.enum(["call", "email", "meeting", "note"]),
  subject: z.string(),
  body: z.string().nullable(),
  occurred_at: timestampSchema,
});

export type Activity = z.infer<typeof activitySchema>;

export function countByStage(
  deals: readonly Pick<Deal, "stage">[],
): Record<DealStage, number> {
  const counts: Record<DealStage, number> = {
    prospecting: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    closed_won: 0,
    closed_lost: 0,
  };

  for (const deal of deals) {
    counts[deal.stage] += 1;
  }

  return counts;
}
