import { Helmet } from 'react-helmet-async';

import DepartmentAppointmentConfigView from 'src/sections/unit-service/departments/view/appointmentconfiguration';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentConfigPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name} Department Appointment Configuration</title>
      </Helmet>

      {data && <DepartmentAppointmentConfigView departmentData={data} />}
    </>
  );
}
