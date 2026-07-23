export function ListLoading({ title }: { title: string }) {
  return (
    <div aria-busy="true" aria-label={`Loading ${title}`}>
      <div className="h-9 w-48 animate-pulse rounded-md bg-black/8" />
      <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-black/6" />
      <div className="mt-8 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="h-12 animate-pulse border-b border-[var(--line)] bg-black/3" />
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="flex h-16 items-center gap-4 border-b border-[var(--line)] px-5 last:border-0"
            key={index}
          >
            <div className="h-4 w-1/3 animate-pulse rounded bg-black/7" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-black/5" />
            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-black/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
