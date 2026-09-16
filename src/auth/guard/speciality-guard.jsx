import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// Which specialty the logged-in doctor practises, for the few screens that differ
// by specialty. The specialities table has no slug, enum or stable code — only
// free-text names an admin can edit — so matching is by name, and the alias list
// lives next to the matcher so it stays auditable.
//
// Exact match on a normalised name, NEVER a substring: 'Accident & Emergency'
// contains "dent", so a substring rule would hand the dental chart to A&E.

// Arabic is written many ways for the same specialty. The seed stores a bare
// 'أسنان', but a clinic may type 'طب الأسنان' — folding alef/teh-marbuta/alef-maqsura
// and stripping harakat makes those the same string.
const normalise = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '') // harakat + tatweel
    .replace(/[أإآٱ]/g, 'ا') // أ إ آ ٱ → ا
    .replace(/ة/g, 'ه') // ة → ه
    .replace(/ى/g, 'ي') // ى → ي
    .replace(/&/g, ' and ')
    .replace(/[.\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Oral & maxillofacial surgery is deliberately absent: in this taxonomy it is a
// surgical specialty, and claiming it for the dental chart is a wider net than
// was asked for. Add it only if a real clinic asks.
const DENTISTRY_ALIASES = new Set(
  [
    'dentistry',
    'dental',
    'dentist',
    'dental medicine',
    'dental surgery',
    'oral and dental medicine',
    'orthodontics',
    'endodontics',
    'periodontics',
    'prosthodontics',
    'أسنان',
    'الأسنان',
    'طب الأسنان',
    'طب أسنان',
    'تقويم الأسنان',
  ].map(normalise)
);

export default function useSpecialityGuard() {
  const { user } = useAuthContext();

  const speciality = user?.employee?.speciality;

  // `/me` populates this for admin and employee roles. A raw ObjectId means the
  // populate did not happen, so there is no name to match — fail closed rather
  // than guess.
  const specialityId = speciality?._id || speciality;

  const names =
    speciality && typeof speciality === 'object'
      ? [speciality.name_english, speciality.name_arabic]
      : [];

  const isDentist = names.some((name) => name && DENTISTRY_ALIASES.has(normalise(name)));

  return { isDentist, specialityId };
}
