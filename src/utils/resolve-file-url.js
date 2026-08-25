// Absolute file URLs are persisted in the database at upload time, built from the
// request's scheme. Records written while the API ran behind a TLS-terminating
// proxy (before `trust proxy` was set) carry an `http://` scheme, and an https
// page refuses to load those as mixed content — the request never reaches the
// network, so it surfaces as a generic "failed to load".
//
// Upgrading the scheme here fixes those stored rows without a data migration.
// Only the scheme is touched; the host and path are left exactly as stored.
export default function resolveFileUrl(url) {
  if (!url || typeof url !== 'string') return url;

  // Nothing to do when the page itself is plain http (local development).
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return url;

  if (!url.startsWith('http://')) return url;

  // Localhost is never reachable over https from a deployed page; leaving it
  // untouched makes the real problem (a stale local URL) visible instead of
  // masking it as a TLS error.
  const host = url.slice('http://'.length).split('/')[0].split(':')[0];
  if (host === 'localhost' || host === '127.0.0.1') return url;

  return `https://${url.slice('http://'.length)}`;
}
