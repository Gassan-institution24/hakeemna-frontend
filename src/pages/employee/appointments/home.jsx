import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeAppointments } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import AppointmentHomeView from 'src/sections/employee/appointments/view/home';
// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  const { user } = useAuthContext();
  // console.log('user', user);
  const { appointmentsData, loading, refetch } = useGetEmployeeAppointments(user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id);
  // console.log('appointmentsData', appointmentsData);
  return (
    <ACLGuard hasContent category="employee" subcategory="appointments" acl="read">
      <Helmet>
        <title>Appointments</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {appointmentsData && (
        <AppointmentHomeView appointmentsData={appointmentsData} refetch={refetch} />
      )}
    </ACLGuard>
  );
}
