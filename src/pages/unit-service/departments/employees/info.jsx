import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeInfoView from 'src/sections/unit-service/departments/employees/view/info-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeInfoPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Info</title>
      </Helmet>

      {data && employeeData && (
        <DepartmentEmployeeInfoView employeeData={employeeData} departmentData={data} />
      )}
    </>
  );
}
