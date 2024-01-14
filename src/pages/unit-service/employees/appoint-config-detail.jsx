import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/unit-service/employees/view/appoint-config-detail';
import { useGetEmployee, useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { id, coid } = params;
  const employeeData = useGetEmployee(id).data;
  const { data, loading, refetch } = useGetAppointmentConfig(coid);
  const name = employeeData?.first_name;

  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

      {!loading && (
        <AppointconfigDetailView
          appointmentConfigData={data || null}
          refetch={refetch}
          loading={loading}
        />
      )}
    </>
  );
}
