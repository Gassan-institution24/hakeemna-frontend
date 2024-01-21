import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/unit-service/employees/view/appoint-config-detail';
import { useGetEmployeeEngagement, useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { id, coid } = params;
  const employeeData = useGetEmployeeEngagement(id).data;
  const { data, loading, refetch } = useGetAppointmentConfig(coid);
  const name = employeeData?.first_name;
  console.log('employeeData',employeeData)

  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

      {!loading && employeeData && (
        <AppointconfigDetailView
          appointmentConfigData={data || null}
          employeeData={employeeData}
          refetch={refetch}
          loading={loading}
        />
      )}
    </>
  );
}
