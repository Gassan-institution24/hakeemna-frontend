import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import DepartmentView from 'src/sections/unit-service/permissions/view/departments';
// ----------------------------------------------------------------------

export default function DepartmentsListPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : departments List</title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentView />
    </ACLGuard>
  );
}
