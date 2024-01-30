import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeACLView from 'src/sections/unit-service/departments/employees/view/acl-view';
import { useGetDepartment, useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeACLPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name;
  return (
    <>
    <ACLGuard hasContent category='employee' subcategory='acl' acl='update'>
      <Helmet>
        <title> {name || ''} Employee ACL</title>
      </Helmet>

      {data && employeeData && (
        <DepartmentEmployeeACLView employeeData={employeeData} departmentData={data} />
      )}
      </ACLGuard>
    </>
  );
}
