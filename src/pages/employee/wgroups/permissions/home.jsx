import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkGroupPermissionsView from 'src/sections/employee/work-groups/view/permissions/home';

// ----------------------------------------------------------------------

export default function WorkGroupPermissionsPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="work_group" subcategory="permissions" acl="update">
      <Helmet>
        <title>{user?.employee?.name_english} : work group permissions</title>
        <meta name="description" content="meta" />
      </Helmet>
      <WorkGroupPermissionsView />
    </ACLGuard>
  );
}
