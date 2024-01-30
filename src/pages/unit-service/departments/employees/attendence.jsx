import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeAttendenceView from 'src/sections/unit-service/departments/employees/view/attendence-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeAttendencePage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="employees" acl="read">
        <Helmet>
          <title> {name || ''} Employee Attendence</title>
        </Helmet>

        {data && employeeData && (
          <DepartmentEmployeeAttendenceView employeeData={employeeData} departmentData={data} />
        )}
      </ACLGuard>
    </>
  );
}
