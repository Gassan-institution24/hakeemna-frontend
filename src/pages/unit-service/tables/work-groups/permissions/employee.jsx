import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkGroupEmployeePermissionsView from 'src/sections/unit-service/tables/work-groups/view/permissions/employee';

// ----------------------------------------------------------------------

export default function WorkGroupEmployeePermissionPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="update">
      <Helmet>
        <title>{serviceUnitName} :  work group permissions </title>
        <meta name="description" content="meta" />
      </Helmet>
      <WorkGroupEmployeePermissionsView />
    </ACLGuard>
  );
}
