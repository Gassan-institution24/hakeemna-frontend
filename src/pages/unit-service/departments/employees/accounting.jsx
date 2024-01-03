import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeAccountingView from 'src/sections/unit-service/departments/employees/view/accounting-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeAccountingPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Accounting</title>
      </Helmet>

      {data && employeeData && (
        <DepartmentEmployeeAccountingView employeeData={employeeData} departmentData={data} />
      )}
    </>
  );
}
