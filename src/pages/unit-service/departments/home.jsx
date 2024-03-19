import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import DepartmentsHomeView from 'src/sections/unit-service/departments/view/home';

// ----------------------------------------------------------------------

export default function DepartmentsHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="departments" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : Departments </title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentsHomeView />
    </ACLGuard>
  );
}
