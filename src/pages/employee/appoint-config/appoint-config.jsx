import { Helmet } from 'react-helmet-async';

import EmployeeAppointconfigView from 'src/sections/employee/appoint-config/view/appoint-config-table';
import { useGetEmployee, useGetUSEmployeeAppointmentConfigs } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const { user } = useAuthContext();
  const { appointmentConfigData, loading, refetch } = useGetUSEmployeeAppointmentConfigs(
    user?.unit_service._id,
    user?.employee?._id
  );

  return (
    <>
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
    </>
  );
}
