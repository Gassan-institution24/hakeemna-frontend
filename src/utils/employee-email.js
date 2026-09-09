/**
 * Employee address generation — the client half.
 *
 * An employee's address is derived from their name and their clinic's name:
 *
 *     employeename@unitservicename.com
 *
 * This mirrors the slug rule in hakeemna-backend/utils/employeeEmail.js so the create form can
 * show the address it is about to create while the name is still being typed. The server is the
 * authority: it rebuilds the address from the same two names and re-checks that it is free,
 * discarding whatever the client sent. This copy is presentation only.
 *
 * Only used when creating. Editing an existing employee leaves the stored address alone.
 */

/** Reduce a display name to the characters an address can carry: lowercase letters and digits. */
export function slugifyForEmail(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * `employeename@unitservicename.com`, or '' when either half slugs away to nothing — an
 * Arabic-only name, or a clinic whose English name has not been filled in.
 *
 * @param {string} employeeName    the employee's English name
 * @param {string} unitServiceName the clinic's English name
 */
export function buildEmployeeEmail(employeeName, unitServiceName) {
  const local = slugifyForEmail(employeeName);
  const domain = slugifyForEmail(unitServiceName);

  if (!local || !domain) return '';

  return `${local}@${domain}.com`;
}

/** The clinic on the signed-in user's currently selected engagement. */
export function getSelectedUnitService(user) {
  return (
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service || null
  );
}
