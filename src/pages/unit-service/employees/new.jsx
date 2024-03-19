import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EmployeeNewView from 'src/sections/unit-service/employees/view/new';

// ----------------------------------------------------------------------

export default function EmployeeNewPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="employees" acl="create">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : New Employee </title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeNewView />
    </ACLGuard>
  );
}
