/**
 * Shared demo/trial account helpers.
 *
 * One definition of "is this demo expired?" for the whole frontend, mirroring
 * hakeemna-backend/utils/demoAccount.js. The table, the status chips and the extend dialog all
 * read from here so they can never disagree with each other or with the server.
 *
 * The server is always the authority — this is presentation only.
 */

export const DEMO_ACCOUNT_TYPES = {
  ALL: 'all',
  DEMO: 'demo',
  NORMAL: 'normal',
};

/**
 * Derive everything the UI needs about a user row's trial.
 *
 * @param {object} row a user document from GET /api/auth
 * @returns {{ isDemo: boolean, expiresAt: Date|null, expired: boolean, daysRemaining: number|null }}
 */
export function getDemoState(row) {
  const isDemo = Boolean(row?.isDemo);

  if (!isDemo) {
    return { isDemo: false, expiresAt: null, expired: false, daysRemaining: null };
  }

  const expiresAt = row?.demoExpiresAt ? new Date(row.demoExpiresAt) : null;

  // A demo row with no expiry is treated as expired, matching the backend's fail-closed rule.
  if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
    return { isDemo: true, expiresAt: null, expired: true, daysRemaining: null };
  }

  const msRemaining = expiresAt.getTime() - Date.now();

  return {
    isDemo: true,
    expiresAt,
    expired: msRemaining <= 0,
    daysRemaining: Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000))),
  };
}

/**
 * Translation key for the account-type chip.
 * Note the keys are 'demo account' / 'normal account', not 'demo' — `demo` is already an
 * object namespace in the locale files (used by the language switcher), so t('demo') would
 * return an object and break rendering.
 */
export function getDemoTypeLabel(row) {
  return getDemoState(row).isDemo ? 'demo account' : 'normal account';
}

/** MUI `Label` colour for the account-type chip. */
export function getDemoTypeColor(row) {
  return getDemoState(row).isDemo ? 'warning' : 'default';
}

/**
 * Trial status shown next to the expiry date.
 * Returns null for normal accounts so the cell can render a plain dash.
 */
export function getDemoStatus(row) {
  const { isDemo, expired } = getDemoState(row);
  if (!isDemo) return null;
  return expired ? { label: 'Expired', color: 'error' } : { label: 'Active', color: 'success' };
}

/** Filters a user list by the account-type tab/select. */
export function filterByAccountType(rows, accountType) {
  if (!accountType || accountType === DEMO_ACCOUNT_TYPES.ALL) return rows;
  if (accountType === DEMO_ACCOUNT_TYPES.DEMO) return rows.filter((row) => row?.isDemo);
  return rows.filter((row) => !row?.isDemo);
}

/**
 * True when the signed-in account is a demo/trial account.
 *
 * Used to hide the public-visibility controls ("show on home page", "visible on online page",
 * "visible in online appointments"). A demo clinic is never listed publicly, so those switches
 * would be dead controls — the server pins the flags off and excludes demo clinics from every
 * public query regardless of what the client sends.
 *
 * Presentation only. The server is the authority; hiding the checkbox is not the enforcement.
 *
 * @param {object} user the object from useAuthContext()
 */
export function isDemoUser(user) {
  return Boolean(user?.isDemo);
}
