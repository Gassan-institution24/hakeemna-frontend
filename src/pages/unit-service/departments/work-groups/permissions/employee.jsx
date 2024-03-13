import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentWorkGroupEmployeePermissionsView from 'src/sections/unit-service/departments/work-groups/permissions/employee';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupEmployeePermissionPage() {
  return (
    <ACLGuard category="department" subcategory="permissions" acl="update">
      <Helmet>
        <title> work group permissions </title>
        <meta name="description" content="meta" />
      </Helmet>
      <DepartmentWorkGroupEmployeePermissionsView />
    </ACLGuard>
  );
}
