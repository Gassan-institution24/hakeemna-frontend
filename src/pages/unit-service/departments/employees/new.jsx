import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeNewView from 'src/sections/unit-service/departments/employees/view/create-view';
import { useGetDepartment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeNewPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="employees" acl="create">
        <Helmet>
          <title> Add Employee </title>
        </Helmet>

        {data && <DepartmentEmployeeNewView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
