import { Helmet } from 'react-helmet-async';
import { useGetUSAppointments } from 'src/api/tables';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

import AppointmentsHomeView from 'src/sections/unit-service/appointments/view/home';

// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  const { user } = useAuthContext();
  const { appointmentsData, loading, refetch } = useGetUSAppointments(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );
  return (
    <>
      <ACLGuard hasContent category="appointment" acl="read">
        <Helmet>
          <title>Appointments</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <AppointmentsHomeView appointmentsData={appointmentsData} refetch={refetch} />}
      </ACLGuard>
    </>
  );
}
