// ----------------------------------------------------------------------
// Returns an object's name in the current language, falling back to the
// other language when the preferred one is empty. Works for any object with
// `name_english` / `name_arabic` fields (patient, unit_service_patient, user,
// employee, work_group, ...).
// ----------------------------------------------------------------------

export function getLocalizedName(obj, curLangAr, fallback = '') {
  if (!obj) return fallback;
  const ar = obj.name_arabic;
  const en = obj.name_english;
  return (curLangAr ? ar || en : en || ar) || fallback;
}
