import { usePathname } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import useSpecialityGuard from 'src/auth/guard/speciality-guard';

// ----------------------------------------------------------------------

// Hakeemna 360 presents two products on one platform: General Medicine and Dental.
// They share every backend, record and permission — only the look, the entry pages and
// the navigation differ. This hook is the single place that decides which one a screen
// belongs to, so the theme, nav and redirects can never disagree.
//
// - Any page under /dental: Dental.
// - Elsewhere, signed-in clinic staff: Dental iff the doctor's speciality is dentistry.
//   The frontend cannot see a clinic-level speciality yet (/me does not return it), so
//   reception and accounting staff of a dental clinic stay on Medicine, the old behaviour.
// - Everyone else: Medicine, unchanged.

export const EXPERIENCE = {
  DENTAL: 'dental',
  MEDICINE: 'medicine',
};

export const DENTAL_ROOT = '/dental';

const STAFF_ROLES = ['admin', 'employee'];

export const isDentalPath = (pathname) =>
  pathname === DENTAL_ROOT || String(pathname || '').startsWith(`${DENTAL_ROOT}/`);

export default function useExperience() {
  const { user } = useAuthContext();
  const { isDentist } = useSpecialityGuard();
  const pathname = usePathname();

  // Pages under /dental are dental for whoever views them (the dashboard there is
  // dentist-only by route guard anyway).
  if (isDentalPath(pathname)) {
    return EXPERIENCE.DENTAL;
  }

  // Patients, suppliers and superadmins have no dental product; their screens keep
  // the existing look.
  return STAFF_ROLES.includes(user?.role) && isDentist ? EXPERIENCE.DENTAL : EXPERIENCE.MEDICINE;
}
