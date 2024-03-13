import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment, useGetUnitservice } from 'src/api';

import DepartmentAppointmentsView from 'src/sections/super-admin/unitservices/departments/view/appointments';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentsPage() {
  const params = useParams();
  const { id, depid } = params;
  const { data } = useGetDepartment(depid);
  const unitServiceData = useGetUnitservice(id).data;
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name || ''} Department Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
        <DepartmentAppointmentsView
          unitServiceData={unitServiceData}
          departmentData={data}
        />
    </>
  );
}
