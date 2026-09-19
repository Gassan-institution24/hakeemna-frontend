import { useMemo, useCallback } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useSearchParams() {
  const [searchParams] = _useSearchParams();

  return useMemo(() => searchParams, [searchParams]);
}

// ----------------------------------------------------------------------

/**
 * Read and write a single query parameter.
 *
 * Other parameters on the URL are preserved, and passing a nullish or empty
 * value removes the key rather than leaving `?tab=` behind.
 *
 * Writes default to `replace`, so a parameter used for in-page state does not
 * fill the history stack — Back should leave the page, not step through it.
 */
export function useSearchParamsState(key, { replace = true } = {}) {
  const [searchParams, setSearchParams] = _useSearchParams();

  const value = searchParams.get(key);

  const setValue = useCallback(
    (next) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          if (next === null || next === undefined || next === '') {
            params.delete(key);
          } else {
            params.set(key, next);
          }
          return params;
        },
        { replace }
      );
    },
    [key, replace, setSearchParams]
  );

  return [value, setValue];
}
