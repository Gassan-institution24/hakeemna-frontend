import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetEmployeeEngagement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeAppointmentsView from 'src/sections/unit-service/employees/view/appointments';

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
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EmployeeAppointmentsView employeeData={data} />}
    </ACLGuard>
  );
}
