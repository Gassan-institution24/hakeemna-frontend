import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import RolesListView from 'src/sections/unit-service/roles/view/roles-list';

export default function RolesHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard permission="permissions:read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Roles</title>
      </Helmet>
      <RolesListView />
    </ACLGuard>
  );
}
