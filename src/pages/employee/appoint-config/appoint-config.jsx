import { Helmet } from 'react-helmet-async';

import EmployeeAppointconfigView from 'src/sections/employee/appoint-config/view/appoint-config-table';
import { useGetEmployee, useGetEmployeeAppointmentConfigs } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { user } = useAuthContext();
  const { appointmentConfigData, loading, refetch } = useGetEmployeeAppointmentConfigs(
    user?.employee_engagement?.employee?._id
  );

  return (
    <>
    <ACLGuard hasContent category='accounting' acl='read' >
      <Helmet>
        <title> Appointment Config</title>
      </Helmet>

      {!loading && (
        <EmployeeAppointconfigView
          appointmentConfigData={appointmentConfigData}
          refetch={refetch}
          loading={loading}
        />
      )}
      </ACLGuard>
    </>
  );
}
