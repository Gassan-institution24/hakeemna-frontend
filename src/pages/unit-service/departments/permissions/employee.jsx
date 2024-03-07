import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentEmployeePermissionsView from 'src/sections/unit-service/departments/permissions/employee';

// ----------------------------------------------------------------------

export default function DepartmentEmployeePermissionPage() {
  return (
    <ACLGuard category="department" subcategory="permissions" acl="update">
      <Helmet>
        <title> department permissions </title>
        <meta name="description" content="meta" />
      </Helmet>
      <DepartmentEmployeePermissionsView />
    </ACLGuard>
  );
}
