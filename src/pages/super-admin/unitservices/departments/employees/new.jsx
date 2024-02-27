import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentEmployeeNewView from 'src/sections/super-admin/unitservices/departments/employees/view/create-view';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeNewPage() {
  const params = useParams();
  const { depid } = params;
  const { data } = useGetDepartment(depid);
  return (
    <ACLGuard hasContent category="department" subcategory="employees" acl="create">
      <Helmet>
        <title> Add Employee </title>
      </Helmet>

      {data && <DepartmentEmployeeNewView departmentData={data} />}
    </ACLGuard>
  );
}
