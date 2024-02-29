import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentEmployeesView from 'src/sections/super-admin/unitservices/departments/view/employees';

// ----------------------------------------------------------------------

export default function DepartmentEmployeesPage() {
  const params = useParams();
  const { depid } = params;
  const { data } = useGetDepartment(depid);
  const name = data?.first_name;
  return (
    <ACLGuard hasContent category="department" subcategory="employees" acl="read">
      <Helmet>
        <title>{name || ''} Department Employees</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <DepartmentEmployeesView departmentData={data} />}
    </ACLGuard>
  );
}
