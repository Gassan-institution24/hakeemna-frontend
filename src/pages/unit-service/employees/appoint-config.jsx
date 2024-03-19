import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetEmployeeEngagement, useGetEmployeeAppointmentConfigs } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeAppointconfigView from 'src/sections/unit-service/employees/view/appoint-config-table';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { id } = params;
  const employeeData = useGetEmployeeEngagement(id).data;
  const { appointmentConfigData, loading, refetch } = useGetEmployeeAppointmentConfigs(id);
  const name = employeeData?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="appointment_configs" acl="read">
      <Helmet>
        <title> {name || 'Employee'} : Appointment Config</title>
        <meta name="description" content="meta" />
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
  );
}
