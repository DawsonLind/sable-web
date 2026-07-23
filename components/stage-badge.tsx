import {
  DEAL_STAGE_LABELS,
  type DealStage,
} from "@/lib/domain";

const STAGE_CLASSES = {
  prospecting: "border-stone-200 bg-stone-100 text-stone-700",
  qualified: "border-sky-200 bg-sky-50 text-sky-700",
  proposal: "border-amber-200 bg-amber-50 text-amber-800",
  negotiation: "border-orange-200 bg-orange-50 text-orange-800",
  closed_won: "border-teal-200 bg-teal-50 text-teal-800",
  closed_lost: "border-red-200 bg-red-50 text-red-700",
} satisfies Record<DealStage, string>;

export function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STAGE_CLASSES[stage]}`}
    >
      {DEAL_STAGE_LABELS[stage]}
    </span>
  );
}
