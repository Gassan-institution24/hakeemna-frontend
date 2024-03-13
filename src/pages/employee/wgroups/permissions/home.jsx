import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import WorkGroupPermissionsView from 'src/sections/employee/work-groups/view/permissions/home';

// ----------------------------------------------------------------------

export default function WorkGroupPermissionsPage() {
  const params = useParams();
  const { wgid } = params;
  const { data, loading } = useGetWorkGroup(wgid);
  const name = data?.name_english;
  return (
    <ACLGuard category="work_group" subcategory="permissions" acl="update">
      <Helmet>
        <title>{name || 'Work group'} permissions</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <WorkGroupPermissionsView />}
    </ACLGuard>
  );
}
