import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentWorkGroupEmployeePermissionsView from 'src/sections/unit-service/departments/work-groups/permissions/employee';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupEmployeePermissionPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <ACLGuard category="department" subcategory="permissions" acl="update">
      <Helmet>
        <title>{data.name_english} : work group permissions </title>
        <meta name="description" content="meta" />
      </Helmet>
      <DepartmentWorkGroupEmployeePermissionsView />
    </ACLGuard>
  );
}
