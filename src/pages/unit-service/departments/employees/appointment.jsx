import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeAppointmentsView from 'src/sections/unit-service/departments/employees/view/appointment-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeAppointmentsPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointments</title>
      </Helmet>

      {data && employeeData && (
        <DepartmentEmployeeAppointmentsView employeeData={employeeData} departmentData={data} />
      )}
    </>
  );
}
