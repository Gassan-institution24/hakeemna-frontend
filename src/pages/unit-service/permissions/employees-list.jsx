import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EmployeesView from 'src/sections/unit-service/permissions/view/employees-list';
// ----------------------------------------------------------------------

export default function EmployeesListPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard permission="permissions:read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : employees List</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeesView />
    </ACLGuard>
  );
}
