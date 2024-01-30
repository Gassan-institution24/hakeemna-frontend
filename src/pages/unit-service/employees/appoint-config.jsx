import { Helmet } from 'react-helmet-async';

import EmployeeAppointconfigView from 'src/sections/unit-service/employees/view/appoint-config-table';
import { useGetEmployeeEngagement, useGetEmployeeAppointmentConfigs } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { user } = useAuthContext();
  const { id } = params;
  const employeeData = useGetEmployeeEngagement(id).data;
  const { appointmentConfigData, loading, refetch } = useGetEmployeeAppointmentConfigs(id);
  console.log('employeeData', employeeData);
  console.log('appointmentConfigData', appointmentConfigData);
  const name = employeeData?.first_name;

  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="appointment_configs" acl="read">
        <Helmet>
          <title> {name || ''} Employee Appointment Config</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && (
          <EmployeeAppointconfigView
            appointmentConfigData={appointmentConfigData}
            employeeData={employeeData}
            refetch={refetch}
            loading={loading}
          />
        )}
      </ACLGuard>
    </>
  );
}
