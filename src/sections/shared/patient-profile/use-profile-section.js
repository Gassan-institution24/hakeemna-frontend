import { useMemo, useCallback } from 'react';

import { useSearchParamsState } from 'src/routes/hooks';

// ----------------------------------------------------------------------

/**
 * The patient profile's active section, held in the URL as `?tab=`.
 *
 * Keeping it in the URL means a refresh returns the doctor to where they were
 * rather than to the default section, the page can be linked to directly, and
 * the section survives the full reload that switching language triggers.
 *
 * A value that is not in `validValues` falls back — which covers both a stale
 * link and a section that exists on one profile but not the other (a med lab,
 * for instance, has no prescriptions section).
 *
 * @param {string[]} validValues sections this profile actually renders
 * @param {string}   fallback    section to show otherwise
 * @returns {[string, (next: string) => void]}
 */
export function useProfileSection(validValues, fallback = 'overview') {
  const [rawValue, setRawValue] = useSearchParamsState('tab');

  // `validValues` is typically a fresh array each render, so key the memo on its
  // contents rather than its identity.
  const validKey = validValues.join('|');

  const section = useMemo(
    () => (rawValue && validValues.includes(rawValue) ? rawValue : fallback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawValue, validKey, fallback]
  );

  const setSection = useCallback(
    (next) => {
      setRawValue(next);
    },
    [setRawValue]
  );

  return [section, setSection];
}
