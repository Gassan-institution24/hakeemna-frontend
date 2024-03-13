import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentWorkGroupPermissionsView from 'src/sections/unit-service/departments/work-groups/permissions/home';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupPermissionsPage() {
  const params = useParams();
  const { wgid } = params;
  const { data, loading } = useGetWorkGroup(wgid);
  const name = data?.name_english;
  return (
    <ACLGuard category="department" subcategory="permissions" acl="update">
      <Helmet>
        <title>{name || 'Work group'} permissions</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentWorkGroupPermissionsView />}
    </ACLGuard>
  );
}
