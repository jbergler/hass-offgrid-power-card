function number(
  value: number,
  locale: string,
  maximumFractionDigits: number,
): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}

export function formatPower(
  watts: number | null,
  locale: string,
  maximumFractionDigits?: number,
): string {
  if (watts === null) {
    return "—";
  }

  if (Math.abs(watts) >= 1000) {
    return `${number(watts / 1000, locale, maximumFractionDigits ?? 1)} kW`;
  }

  return `${number(watts, locale, maximumFractionDigits ?? (Math.abs(watts) < 100 ? 1 : 0))} W`;
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
    return `${number(totalMinutes, locale, 0)} min`;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${number(days, locale, 0)} d`);
  }
  if (hours > 0) {
    parts.push(`${number(hours, locale, 0)} h`);
  }
  if (minutes > 0 && days === 0) {
    parts.push(`${number(minutes, locale, 0)} min`);
  }

  return parts.join(" ") || "0 min";
}
