import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetEmployeeEngagement } from 'src/api';

import EmployeeAppointmentsView from 'src/sections/unit-service/employees/view/appointments';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetEmployeeEngagement(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="unit_service" subcategory="appointments" acl="read">
      <Helmet>
        <title>{name || ''} Employee Appointments</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeAppointmentsView employeeData={data} />}
    </ACLGuard>
  );
}
