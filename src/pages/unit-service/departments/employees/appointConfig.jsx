import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeAppointconfigView from 'src/sections/unit-service/departments/employees/view/appointconfig-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeAppointconfigPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

      {data && employeeData && (
        <DepartmentEmployeeAppointconfigView employeeData={employeeData} departmentData={data} />
      )}
    </>
  );
}
