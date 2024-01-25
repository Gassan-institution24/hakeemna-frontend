import { Helmet } from 'react-helmet-async';

import DepartmentAppointmentsView from 'src/sections/unit-service/departments/view/appointments';
import { useGetDepartment, useGetDepartmentAppointments } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const {appointmentsData,refetch} = useGetDepartmentAppointments(id)
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Department Appointments</title>
      </Helmet>

      {data && <DepartmentAppointmentsView departmentData={data} appointmentsData={appointmentsData} refetch={refetch} />}
    </>
  );
}
