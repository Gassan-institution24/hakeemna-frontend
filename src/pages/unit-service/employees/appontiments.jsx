import { Helmet } from 'react-helmet-async';

import EmployeeAppointmentsView from 'src/sections/unit-service/employees/view/appointments';
import { useGetEmployeeEngagement, useGetEmployeeAppointments } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployeeEngagement(id);
  const { appointmentsData, refetch,loading } = useGetEmployeeAppointments(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="appointment" acl="read">
        <Helmet>
          <title>{name || ''} Employee Appointments</title>
        </Helmet>
        {loading&& <LoadingScreen/>}
        {!loading && (
          <EmployeeAppointmentsView
            appointmentsData={appointmentsData}
            employeeData={data}
            refetch={refetch}
          />
        )}
      </ACLGuard>
    </>
  );
}
