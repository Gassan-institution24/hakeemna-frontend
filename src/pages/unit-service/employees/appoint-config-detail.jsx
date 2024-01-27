import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/unit-service/employees/view/appoint-config-detail';
import { useGetEmployeeEngagement, useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { id, coid } = params;
  const employeeData = useGetEmployeeEngagement(id).data;
  const { data, loading, refetch } = useGetAppointmentConfig(coid);
  const name = employeeData?.first_name;
  console.log('employeeData', employeeData);

  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="update">
        <Helmet>
          <title> {name || ''} Employee Appointment Config</title>
        </Helmet>
        {loading&& <LoadingScreen/>}
        {!loading && (
          <AppointconfigDetailView
            appointmentConfigData={data || null}
            employeeData={employeeData}
            refetch={refetch}
            loading={loading}
          />
        )}
      </ACLGuard>
    </>
  );
}
