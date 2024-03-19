import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EmployeeAppointconfigView from 'src/sections/employee/appoint-config/view/appoint-config-table';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="work_group" subcategory="appointment_configs" acl="read">
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Appointment Config </title>
        <meta name="description" content="meta" />
      </Helmet>
      <EmployeeAppointconfigView />
    </ACLGuard>
  );
}
