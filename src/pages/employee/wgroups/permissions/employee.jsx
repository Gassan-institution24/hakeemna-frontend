import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkGroupEmployeePermissionsView from 'src/sections/employee/work-groups/view/permissions/employee';

// ----------------------------------------------------------------------

export default function WorkGroupEmployeePermissionPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="work_group" subcategory="permissions" acl="update">
      <Helmet>
        <title>{user?.employee?.name_english} : work group permissions </title>
        <meta name="description" content="meta" />
      </Helmet>
      <WorkGroupEmployeePermissionsView />
    </ACLGuard>
  );
}
