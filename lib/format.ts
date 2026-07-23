const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatUsd(amount: number): string {
  return usdFormatter.format(amount);
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}
