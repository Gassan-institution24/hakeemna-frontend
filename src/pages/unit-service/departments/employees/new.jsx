import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentEmployeeNewView from 'src/sections/unit-service/departments/employees/view/create-view';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeNewPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <ACLGuard category="department" subcategory="employees" acl="create">
      <Helmet>
        <title> Add Employee </title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <DepartmentEmployeeNewView departmentData={data} />}
    </ACLGuard>
  );
}
