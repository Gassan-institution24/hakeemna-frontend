import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/unit-service/employees/view/appoint-config-detail';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function NewEmployeeAppointconfigPage() {
  const params = useParams();
  const { id, coid } = params;
  const employeeData = useGetEmployee(id).data;
  const name = employeeData?.first_name;

  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

        <AppointconfigDetailView
        />
    </>
  );
}
