import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// Which specialty the logged-in doctor practises, for the few screens that differ
// by specialty.

export default function useSpecialityGuard() {
  const { user } = useAuthContext();

  const speciality = user?.employee?.speciality;

  // `/me` populates this for admin and employee roles; it may also be a raw ObjectId.
  const specialityId = speciality?._id || speciality;

  return { specialityId };
}
