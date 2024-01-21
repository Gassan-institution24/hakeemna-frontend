import { Helmet } from 'react-helmet-async';

import EmployeeAppointmentsView from 'src/sections/unit-service/employees/view/appointments';
import { useGetEmployeeEngagement,useGetEmployeeAppointments } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployeeEngagement(id);
  const { appointmentsData, refetch } = useGetEmployeeAppointments(
    id
  );
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Employee Appointments</title>
      </Helmet>

      {appointmentsData  && <EmployeeAppointmentsView appointmentsData={appointmentsData} employeeData={data} refetch={refetch} />}
    </>
  );
}
