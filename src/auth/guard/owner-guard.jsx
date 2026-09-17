import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// Is the signed-in user the owner of the clinic they are currently working in?
//
// Ownership lives on the engagement, not the user, so it is per unit service:
// someone can own one clinic and merely work at another. Used to gate the few
// settings that belong to whoever runs the clinic rather than to staff — an
// employee's speciality among them, since that decides what the system lets a
// doctor do.
//
// This mirrors the server-side check in updateOneEmployee; it exists to keep the
// UI honest, not to enforce anything. The API is the enforcement.
export default function useOwnerGuard() {
  const { user } = useAuthContext();

  const engagement =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];

  const isOwner = user?.role === 'superadmin' || Boolean(engagement?.is_owner);

  return { isOwner };
}
