import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import { LoadingScreen } from 'src/components/loading-screen';

import WorkGroupPermissionsView from 'src/sections/unit-service/tables/work-groups/view/permissions/home';

// ----------------------------------------------------------------------

export default function WorkGroupPermissionsPage() {
  const params = useParams();
  const { wgid } = params;
  const { data, loading } = useGetWorkGroup(wgid);
  const name = data?.name_english;

  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="update">
      <Helmet>
        <title>
          {serviceUnitName} : {name} permissions
        </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <WorkGroupPermissionsView />}
    </ACLGuard>
  );
}
