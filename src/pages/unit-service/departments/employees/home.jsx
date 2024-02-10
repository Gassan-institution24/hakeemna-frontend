import { Helmet } from 'react-helmet-async';

import DepartmentEmployeesView from 'src/sections/unit-service/departments/view/employees';
import { useGetDepartment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentEmployeesPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.first_name;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="employees" acl="read">
        <Helmet>
          <title>{name || ''} Department Employees</title>
        </Helmet>

        {data && <DepartmentEmployeesView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
