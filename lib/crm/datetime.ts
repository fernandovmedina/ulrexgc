const pad = (value: number, length = 2) => String(value).padStart(length, "0");

export function utcToLocalDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

export function localDateTimeInputToUtc(value: string | null | undefined, referenceValue?: string | null) {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second = "0", fraction = "0"] = match;
  const parts = [Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Number(fraction.padEnd(3, "0"))] as const;
  const wallClockUtc = Date.UTC(...parts);
  const candidates: Date[] = [];
  for (let offsetMinutes = -14 * 60; offsetMinutes <= 14 * 60; offsetMinutes += 15) {
    const candidate = new Date(wallClockUtc + offsetMinutes * 60000);
    if (candidate.getFullYear() === parts[0] && candidate.getMonth() === parts[1] && candidate.getDate() === parts[2] && candidate.getHours() === parts[3] && candidate.getMinutes() === parts[4] && candidate.getSeconds() === parts[5] && candidate.getMilliseconds() === parts[6]) candidates.push(candidate);
  }
  if (!candidates.length) return null;
  const referenceTime = referenceValue ? new Date(referenceValue).getTime() : Number.NaN;
  if (Number.isFinite(referenceTime)) candidates.sort((a, b) => Math.abs(a.getTime() - referenceTime) - Math.abs(b.getTime() - referenceTime));
  return candidates[0].toISOString();
}

export function preserveUnchangedDateTime(localValue: string, originalValue: string | null | undefined) {
  if (originalValue && localValue === utcToLocalDateTimeInput(originalValue)) return originalValue;
  return localDateTimeInputToUtc(localValue, originalValue);
}

export function dateOnlyToInput(value: string | null | undefined) { return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""; }
export function dateInputToStored(value: string | null | undefined) { return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null; }
export function formatDateOnly(value: string | null | undefined) { if (!value) return "Not provided"; const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!match) return value; return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString(); }
export function localDateToDateInput(date: Date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
export function localDateToDateTimeInput(date: Date) { return `${localDateToDateInput(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`; }
export function dateInputToLocalDate(value: string) { const match = dateOnlyToInput(value).match(/^(\d{4})-(\d{2})-(\d{2})$/); return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null; }
