type DateValue = Date | string | null | undefined;

function normalizeDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : value;
}

export function toDateValue(value: DateValue) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date ? value : new Date(normalizeDateInput(value));

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getLatestDate(values: DateValue[]) {
  const timestamps = values
    .map((value) => toDateValue(value)?.getTime())
    .filter((value): value is number => typeof value === "number");

  if (!timestamps.length) {
    return undefined;
  }

  return new Date(Math.max(...timestamps));
}

export function isDateOnOrAfter(value: DateValue, threshold: Date) {
  const date = toDateValue(value);

  return Boolean(date && date.getTime() >= threshold.getTime());
}
