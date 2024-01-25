import { Helmet } from 'react-helmet-async';
import { useGetEmployeeAppointments } from 'src/api/tables';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import AppointmentHomeView from 'src/sections/employee/appointments/view/home';
// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  const { user } = useAuthContext();
  console.log('user', user);
  const { appointmentsData, refetch } = useGetEmployeeAppointments(
    user?.employee_engagement?.employee?._id
  );
  console.log('appointmentsData', appointmentsData);
  return (
    <>
    <ACLGuard hasContent category='appointment' acl='read'>
      <Helmet>
        <title>Appointments</title>
      </Helmet>

      {appointmentsData && (
        <AppointmentHomeView appointmentsData={appointmentsData} refetch={refetch} />
      )}
      </ACLGuard>
    </>
  );
}
