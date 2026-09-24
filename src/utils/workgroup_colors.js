/**
 * Work-group colour — the client half of the palette defined in the backend's
 * utils/workGroupColors.js. Keep the two in step.
 *
 * What was here before generated a random hex per work group on every call. That meant a group
 * was a different colour on every page load, two groups in the same list could come out nearly
 * identical, and the generator could return near-white or near-black values invisible against
 * the surface. Colour is now a real, stored property of the work group; this module's job is to
 * read it and to answer sensibly when it is missing.
 *
 * The eight hues below are the same fixed order the backend assigns from, validated against this
 * app's own surfaces (light #FFFFFF, dark #212B36) for colour-vision-deficiency separation. Slot
 * order is the accessibility mechanism, not decoration — do not reorder without re-validating.
 *
 * Three light slots and one dark slot sit below 3:1 contrast against the surface. That is only
 * acceptable because a group's name is always rendered beside its colour: the colour is a
 * scanning aid, never the carrier of identity. Do not build a surface that shows the swatch alone.
 */

// Slot order matches the backend exactly. Index 0 is the first colour a clinic is given.
export const WORK_GROUP_PALETTE = [
  { name: 'blue', light: '#2a78d6', dark: '#3987e5' },
  { name: 'orange', light: '#eb6834', dark: '#d95926' },
  { name: 'aqua', light: '#1baf7a', dark: '#199e70' },
  { name: 'yellow', light: '#eda100', dark: '#c98500' },
  { name: 'magenta', light: '#e87ba4', dark: '#d55181' },
  { name: 'green', light: '#008300', dark: '#008300' },
  { name: 'violet', light: '#4a3aa7', dark: '#9085e9' },
  { name: 'red', light: '#e34948', dark: '#e66767' },
];

/**
 * A stable index derived from an id.
 *
 * Only used when a group has no stored colour — a group created before colour existed, or one
 * reached through a projection that left the field out. Deterministic, so at least the colour
 * stops changing between renders while the backfill is pending.
 */
const hashIndex = (value) => {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % WORK_GROUP_PALETTE.length;
};

/**
 * The colour to paint a work group, for the current theme mode.
 *
 * Prefers the colour stored on the group. Falls back to a deterministic palette slot derived
 * from the group's id, so an un-backfilled group still gets a stable, legible colour rather than
 * a blank or a random one.
 *
 * @param {object|string} group a populated work group, or just its id
 * @param {boolean} isDark      whether the dark surface is in use
 * @returns {string} a hex colour
 */
export function getWorkGroupColor(group, isDark = false) {
  if (!group) return null;

  const stored = typeof group === 'object' ? group.color : null;
  const id = typeof group === 'object' ? group._id : group;

  if (stored) {
    // A stored colour is used as given on light. On dark, a palette colour swaps to its
    // dark-surface step; a colour someone picked by hand is left alone, because second-guessing
    // a deliberate choice is worse than a slightly off step.
    if (!isDark) return stored;
    const slot = WORK_GROUP_PALETTE.find(
      (one) => one.light.toLowerCase() === String(stored).toLowerCase()
    );
    return slot ? slot.dark : stored;
  }

  const slot = WORK_GROUP_PALETTE[hashIndex(id)];
  return isDark ? slot.dark : slot.light;
}

/**
 * Attach a `color` to each row from its work group, for list views that colour-code by group.
 *
 * Kept as a named export because the patient lists already call it. Behaviour changed: it now
 * resolves the group's real colour instead of inventing one, and rows with no group get null
 * rather than a random colour that implied a grouping which did not exist.
 *
 * @param {object[]} data rows carrying a `work_group` (or `work_groups[]`)
 * @param {boolean}  isDark
 */
export function addWorkGroupColors(data, isDark = false) {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    // unit_service_patient carries both the legacy scalar and the authoritative array.
    const group = item.work_group || item.work_groups?.[0] || null;
    return { ...item, color: getWorkGroupColor(group, isDark) };
  });
}

export default getWorkGroupColor;
