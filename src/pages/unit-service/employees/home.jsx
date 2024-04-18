import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EmployeeHomeView from 'src/sections/unit-service/employees/view/home';

// ----------------------------------------------------------------------

export default function EmployeeHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="employees" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Employees</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeHomeView />
    </ACLGuard>
  );
}
