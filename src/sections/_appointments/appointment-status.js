// ----------------------------------------------------------------------
// Single source of truth for appointment status UI across every appointments
// list page. Replaces the two divergent `status -> color` switches that used to
// live in each home.jsx and appointment-row.jsx.
//
// The page shows 6 LIFECYCLE tabs. The transient statuses (late / not arrived /
// not booked) fold into their lifecycle group and are shown as a small chip on
// the row instead of getting their own tab.
// ----------------------------------------------------------------------

// `value` is what the backend list endpoints expect as the `status` filter.
export const LIFECYCLE_TABS = [
  { value: 'available', labelKey: 'available', color: 'default' },
  { value: 'booked', labelKey: 'booked', color: 'info' },
  { value: 'arrived', labelKey: 'arrived', color: 'success' },
  { value: 'processing', labelKey: 'in progress', color: 'warning' },
  { value: 'finished', labelKey: 'finished', color: 'success' },
  { value: 'canceled', labelKey: 'canceled', color: 'error' },
];

// Med-lab units keep a reduced set (no arrive / in-progress stages).
export const MEDLAB_TAB_VALUES = ['available', 'booked', 'finished', 'canceled'];
export const MEDLAB_LIFECYCLE_TABS = LIFECYCLE_TABS.filter((tab) =>
  MEDLAB_TAB_VALUES.includes(tab.value)
);

// Displayed status (from the `status` virtual) -> lifecycle group.
const STATUS_TO_LIFECYCLE = {
  available: 'available',
  'not booked': 'available',
  booked: 'booked',
  late: 'booked',
  'not arrived': 'booked',
  arrived: 'arrived',
  processing: 'processing',
  finished: 'finished',
  canceled: 'canceled',
};

// Lifecycle group -> chip color for the status Label.
export const LIFECYCLE_COLOR = {
  available: 'default',
  booked: 'info',
  arrived: 'success',
  processing: 'warning',
  finished: 'success',
  canceled: 'error',
};

const LIFECYCLE_LABEL_KEY = Object.fromEntries(
  LIFECYCLE_TABS.map((tab) => [tab.value, tab.labelKey])
);

// Transient sub-status -> small chip shown NEXT TO the lifecycle Label. Only for
// statuses that AUGMENT the lifecycle (a Booked appointment that is also Late /
// Not-arrived). 'not booked' is handled separately below because it REPLACES the
// label (an expired slot is not "Available").
const DERIVED_CHIP = {
  late: { labelKey: 'late', color: 'warning' },
  'not arrived': { labelKey: 'not arrived', color: 'error' },
};

// Given a row, return the primary status label + optional derived chip.
export function deriveRowDisplay(row) {
  const status = row?.status;

  // A past, unbooked slot: show it as "Expired" on its own (it is no longer
  // available for booking), while still counting under the Available lifecycle.
  if (status === 'not booked') {
    return { lifecycle: 'available', labelKey: 'expired', color: 'default', chip: null };
  }

  const lifecycle = STATUS_TO_LIFECYCLE[status] || 'available';
  return {
    lifecycle,
    labelKey: LIFECYCLE_LABEL_KEY[lifecycle] || lifecycle,
    color: LIFECYCLE_COLOR[lifecycle] || 'default',
    chip: DERIVED_CHIP[status] || null,
  };
}

// Tab count from backend `lengths` — prefer the grouped g_* keys, fall back to
// summing the legacy per-status keys (keeps working if the backend is older).
export function tabCount(lengths = {}, value) {
  const grouped = lengths[`g_${value}`];
  if (grouped !== undefined && grouped !== null) return grouped;
  const fallback = {
    available: (lengths.available || 0) + (lengths.notBooked || 0),
    booked: (lengths.booked || 0) + (lengths.late || 0) + (lengths.notArrived || 0),
    arrived: lengths.arrived || 0,
    processing: lengths.processing || 0,
    finished: lengths.finished || 0,
    canceled: lengths.canceled || 0,
  };
  return fallback[value] || 0;
}
