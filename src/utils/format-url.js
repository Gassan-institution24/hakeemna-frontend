// ----------------------------------------------------------------------

/**
 * Normalize a stored file URL for display.
 * - Converts Windows-style backslashes to forward slashes.
 * - Downgrades https://localhost to http://localhost (dev uploads are served over http).
 *
 * Mirrors the local `fixURL` helpers used in the medical-report / sick-leave PDFs.
 *
 * @param {string} url
 * @returns {string|null}
 */
export function fixURL(url) {
  if (!url) return null;
  let newUrl = url.replace(/\\/g, '/');
  newUrl = newUrl.replace('https://localhost', 'http://localhost');
  return newUrl;
}
