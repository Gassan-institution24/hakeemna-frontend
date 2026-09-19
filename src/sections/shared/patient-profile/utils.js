// Helpers shared by both patient profiles — the doctor's view
// (sections/employee/patients) and the institution's (sections/unit-service/patients).
// They live here rather than in either section so the two cannot drift apart again.

// ----------------------------------------------------------------------

/**
 * Flatten a unit-service patient record into one object for the banner and overview.
 *
 * A unit-service patient may or may not be linked to a global patient account:
 * walk-ins have no `patient` ref. Where both exist the unit-service record wins,
 * because that is the copy this clinic maintains.
 *
 * `useGetOneUSPatient` defaults its data to `[]`, so while the request is in
 * flight this receives an array — and `{ ...[] }` is `{}`, which would silently
 * read every field as undefined. Return null instead so callers can show a
 * loading state rather than an empty one.
 *
 * Panes keep receiving the raw response; this is for the shell only.
 */
export function mergeUsPatient(usPatientData) {
  if (!usPatientData || typeof usPatientData !== 'object' || Array.isArray(usPatientData)) {
    return null;
  }

  const { patient, ...usp } = usPatientData;

  // `patient` is kept on the result so callers can still test for a linked
  // account (`merged.patient?._id`) after the spread.
  return patient && typeof patient === 'object'
    ? { ...patient, ...usp, patient }
    : { ...usp, patient: undefined };
}

// ----------------------------------------------------------------------

/**
 * Whole years since a date of birth.
 *
 * Returns null rather than a number for a missing, unparseable or implausible
 * date, so the caller can omit the field instead of printing "0 years" or NaN.
 */
export function calculateAge(birthDate) {
  if (!birthDate) return null;

  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;

  const diff = Date.now() - born.getTime();
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));

  return years >= 0 && years < 150 ? years : null;
}

// ----------------------------------------------------------------------

/**
 * Read a display name off a populated ref, in the active language.
 *
 * Refs arrive either populated or as a raw ObjectId string depending on what the
 * endpoint was asked to populate, so a string is treated as "no name available"
 * rather than rendered as an id.
 *
 * Catalogs are not consistent about their columns: medicines use
 * `trade_name`/`scientific_name` and have no Arabic at all, and diseases use
 * `Name`. Both fall back here so one helper covers every ref on the record.
 */
export function getLocalizedName(value, isArabic) {
  if (!value || typeof value === 'string') return null;

  const name = isArabic
    ? value.name_arabic || value.name_english
    : value.name_english || value.name_arabic;

  return name || value.trade_name || value.scientific_name || value.Name || null;
}

// ----------------------------------------------------------------------

/**
 * Up to two initials for an avatar fallback.
 */
export function getInitials(name = '') {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
}

// ----------------------------------------------------------------------

/**
 * Body mass index from height in cm and weight in kg, to one decimal place.
 *
 * A derived figure, not a stored one. Null unless both inputs are present and
 * plausible, so an overview never shows a BMI computed from a typo.
 */
export function calculateBmi(heightCm, weightKg) {
  const height = Number(heightCm);
  const weight = Number(weightKg);

  if (!Number.isFinite(height) || !Number.isFinite(weight)) return null;
  if (height < 30 || height > 260 || weight < 1 || weight > 500) return null;

  const metres = height / 100;
  const bmi = weight / (metres * metres);

  return Number.isFinite(bmi) ? Math.round(bmi * 10) / 10 : null;
}
