function number(
  value: number,
  locale: string,
  maximumFractionDigits: number,
): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}

function formatUnit(
  value: number,
  locale: string,
  unit: "day" | "hour" | "minute",
): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "long",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPower(
  watts: number | null,
  locale: string,
  wattMaximumFractionDigits?: number,
): string {
  if (watts === null) {
    return "—";
  }

  if (Math.abs(watts) >= 1000) {
    return `${number(watts / 1000, locale, 1)} kW`;
  }

  return `${number(watts, locale, wattMaximumFractionDigits ?? (Math.abs(watts) < 100 ? 1 : 0))} W`;
}

export function formatEnergy(wattHours: number | null, locale: string): string {
  if (wattHours === null) {
    return "—";
  }

  if (Math.abs(wattHours) >= 1000) {
    return `${number(wattHours / 1000, locale, 1)} kWh`;
  }

  return `${number(wattHours, locale, Math.abs(wattHours) < 100 ? 1 : 0)} Wh`;
}

export function formatDuration(seconds: number | null, locale: string): string {
  if (seconds === null) {
    return "—";
  }

  const totalMinutes = Math.max(0, Math.round(seconds / 60));
  if (totalMinutes < 60) {
    return formatUnit(totalMinutes, locale, "minute");
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const parts: string[] = [];

  if (days > 0) {
    parts.push(formatUnit(days, locale, "day"));
  }
  if (hours > 0) {
    parts.push(formatUnit(hours, locale, "hour"));
  }
  if (minutes > 0 && days === 0) {
    parts.push(formatUnit(minutes, locale, "minute"));
  }

  return parts.join(", ") || formatUnit(0, locale, "minute");
}
