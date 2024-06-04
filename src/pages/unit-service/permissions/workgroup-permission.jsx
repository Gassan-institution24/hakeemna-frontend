import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkGroupPermissionsView from 'src/sections/unit-service/permissions/view/workgroups';
// ----------------------------------------------------------------------

export default function WorkGroupPermissionsPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  const { emid, wgid } = useParams();
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Work Groups permissions</title>
        <meta name="description" content="meta" />
      </Helmet>

      {emid && wgid && <WorkGroupPermissionsView />}
    </ACLGuard>
  );
}
