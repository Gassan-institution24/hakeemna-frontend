import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import DepartmentsNewView from 'src/sections/unit-service/departments/view/new';

// ----------------------------------------------------------------------

export default function DepartmentsNewPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="departments" acl="create">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} :New Department </title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentsNewView />
    </ACLGuard>
  );
}
