import { Helmet } from 'react-helmet-async';

import EmployeeAppointconfigView from 'src/sections/employee/appoint-config/view/appoint-config-table';
import { useGetEmployee, useGetEmployeeAppointmentConfigs } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { user } = useAuthContext();
  const { appointmentConfigData, loading, refetch } = useGetEmployeeAppointmentConfigs(
    user?.employee?._id
  );

  return (
    <>
      <ACLGuard hasContent category="employee" subcategory="appointment_configs" acl="read">
        <Helmet>
          <title> Appointment Config</title>
        </Helmet>
        {loading && <LoadingScreen />}
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
