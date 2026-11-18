const manilaTime = new Intl.DateTimeFormat('en', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
});

function manilaDateTime(date: Date) {
  const parts = Object.fromEntries(manilaTime.formatToParts(date).map(({ type, value }) => [type, value]));
  const year = parts.year.padStart(4, '0');
  return `${year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

export function formatEventStart(date: Date) {
  return manilaDateTime(date).slice(0, 16);
}

function parseEventStart(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) || value.startsWith('0000')) return null;
  const utc = new Date(`${value}:00Z`);
  if (!Number.isFinite(utc.getTime()) || utc.toISOString().slice(0, 16) !== value) return null;

  // Interpret the wall time in Manila using the offset in effect on that date.
  const manilaAsUtc = Date.parse(`${manilaDateTime(utc)}Z`);
  if (!Number.isFinite(manilaAsUtc)) return null;
  const startAt = new Date(utc.getTime() - (manilaAsUtc - utc.getTime()));
  return manilaDateTime(startAt) === `${value}:00` ? startAt : null;
}

export function readEventForm(form: FormData) {
  for (const field of ['title', 'description', 'startAt', 'capacity', 'status']) {
    if (form.getAll(field).length > 1) return { error: 'Submit only one value per event field.' };
  }

  const title = form.get('title');
  const description = form.get('description');
  const start = form.get('startAt');
  const capacityInput = form.get('capacity') ?? '';
  const status = form.get('status') ?? 'draft';

  if (typeof title !== 'string' || !title.trim()) return { error: 'Title is required.' };
  if (description !== null && typeof description !== 'string') return { error: 'Description must be text.' };
  const startAt = typeof start === 'string' ? parseEventStart(start) : null;
  if (!startAt) return { error: 'Enter a valid start date and time in Manila time.' };
  if (status !== 'draft' && status !== 'open' && status !== 'closed') {
    return { error: 'Choose a valid event status.' };
  }
  if (typeof capacityInput !== 'string' || (capacityInput !== '' && !/^\d+$/.test(capacityInput))) {
    return { error: 'Enter a positive whole number for capacity or leave it blank.' };
  }
  const capacity = capacityInput === '' ? null : Number(capacityInput);
  if (capacity !== null && (capacity < 1 || capacity > 2_147_483_647)) {
    return { error: 'Capacity must be between 1 and 2,147,483,647 or left blank.' };
  }

  return { values: { title: title.trim(), description: description?.trim() || null, startAt, capacity, status } };
}
