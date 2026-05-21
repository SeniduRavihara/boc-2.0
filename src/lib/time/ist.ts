const IST_TIMEZONE = 'Asia/Kolkata';

interface ISTDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function getISTParts(date: Date): ISTDateParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '0';

  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10),
  };
}

/** True when the instant is at or after 20:00 on the IST calendar day. */
export function isAfter8pmIST(now: Date = new Date()): boolean {
  const { hour, minute } = getISTParts(now);
  return hour > 20 || (hour === 20 && minute >= 0);
}

/** Milliseconds until 20:00 IST today; 0 if already past 8 PM IST. */
export function getMsUntil8pmIST(now: Date = new Date()): number {
  if (isAfter8pmIST(now)) return 0;

  const { year, month, day } = getISTParts(now);
  const target = new Date(
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T20:00:00+05:30`
  );

  return Math.max(0, target.getTime() - now.getTime());
}

/** Whether two instants fall on the same calendar day in IST. */
export function isSameISTCalendarDay(a: Date, b: Date): boolean {
  const pa = getISTParts(a);
  const pb = getISTParts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}
