import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import WorkGroupEmployeePermissionsView from 'src/sections/unit-service/tables/work-groups/view/permissions/employee';

// ----------------------------------------------------------------------

export default function WorkGroupEmployeePermissionPage() {
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="update">
      <Helmet>
        <title> work group permissions </title>
        <meta name="description" content="meta" />
      </Helmet>
      <WorkGroupEmployeePermissionsView />
    </ACLGuard>
  );
}
