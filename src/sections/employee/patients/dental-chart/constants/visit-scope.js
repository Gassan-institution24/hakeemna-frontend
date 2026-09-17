// Scoping chart records to the appointment they were recorded in.
//
// Opened from an encounter, the chart is about *this* visit: the treatments,
// notes and radiographs of the appointment being worked on. Everything earlier
// moves behind a "show old history" button so the doctor is not reading years of
// records while treating. Opened standalone, nothing is scoped and the full list
// shows exactly as it always did.
//
// Records written before visit-stamping existed have no `visit`. They are never
// hidden — they fall back to grouping by the day they happened, which is how
// they were implicitly grouped anyway.

// A ref may arrive populated or as a raw ObjectId.
export const idOf = (value) => {
  if (!value) return null;
  return String(value._id || value);
};

export const dayKey = (value) => {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? 'unknown' : date.toISOString().slice(0, 10);
};

/**
 * Collapse records into one group per visit, newest group first.
 *
 * Each row needs `visitId` and `date`. A group's date is the latest date among
 * its rows, so a group sorts by when it actually happened.
 */
export function groupByVisit(rows) {
  const groups = new Map();

  (rows || []).forEach((row) => {
    const key = row.visitId ? `v-${row.visitId}` : `d-${dayKey(row.date)}`;
    if (!groups.has(key)) {
      groups.set(key, { key, visitId: row.visitId || null, date: row.date, rows: [] });
    }
    const group = groups.get(key);
    group.rows.push(row);
    if (new Date(row.date || 0) > new Date(group.date || 0)) group.date = row.date;
  });

  return [...groups.values()].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

/**
 * Split records into the current visit's and everything before it.
 *
 * With no visit — the standalone chart — `current` is every row and `history` is
 * empty, which keeps that page behaving exactly as it did before scoping existed.
 */
export function splitByVisit(rows, visitId) {
  const all = rows || [];
  if (!visitId) return { current: all, history: [] };

  const id = String(visitId);
  return {
    current: all.filter((row) => row.visitId === id),
    history: groupByVisit(all.filter((row) => row.visitId !== id)),
  };
}
