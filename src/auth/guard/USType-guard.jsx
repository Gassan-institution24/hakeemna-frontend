import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function useUSTypeGuard() {
  const { user } = useAuthContext();
  const labsIds = [
    '667bc3364700fe052099ff76',
    '65f7007d2ad57a61982dbc4f',
    '65f700a02ad57a61982dbc66',
    '65f700f92ad57a61982dbc8a',
  ];
  const currentUSTypeId =
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?.US_type
      ?._id ||
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
      ?.US_type;

  const isMedLab = labsIds.includes(currentUSTypeId);

  return { isMedLab };
}
