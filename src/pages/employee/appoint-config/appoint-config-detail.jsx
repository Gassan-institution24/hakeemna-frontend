import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/employee/appoint-config/view/appoint-config-detail';
import { useGetEmployee, useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { coid } = params;
  const { data, loading, refetch } = useGetAppointmentConfig(coid);

  return (
    <>
      <Helmet>
        <title> Appointment Config Detail</title>
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
