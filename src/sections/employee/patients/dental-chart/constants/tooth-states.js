// Teeth hidden by the chart's display options.
//
// Purely a view concern: nothing here is persisted or sent to the API.

// Wisdom teeth (third molars). Hidden rather than removed from the arch, matching
// upstream: the tile keeps its slot so the arch never re-centres and bridge spans
// stay aligned. Primary dentition has no third molars.
export const WISDOM_TEETH = [18, 28, 38, 48];

/**
 * Teeth hidden by the current view options.
 *
 * @param {object} viewOptions  { showWisdom, ... }
 * @returns {Set<number>|null} null when nothing is hidden
 */
export function getHiddenTeeth(viewOptions) {
  if (!viewOptions || viewOptions.showWisdom !== false) return null;
  return new Set(WISDOM_TEETH);
}

export default getHiddenTeeth;
