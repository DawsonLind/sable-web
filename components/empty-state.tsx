import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-[var(--line)] bg-white px-6 text-center">
      <div>
        <div className="mx-auto grid size-10 place-items-center rounded-full bg-black/5 text-[var(--muted)]">
          <Inbox aria-hidden="true" size={19} />
        </div>
        <p className="mt-4 text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
    </div>
  );
}
