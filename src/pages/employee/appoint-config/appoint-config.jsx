import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EmployeeAppointconfigView from 'src/sections/employee/appoint-config/view/appoint-config-table';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard permission="appointment_configs:read">
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Appointment Config </title>
        <meta name="description" content="meta" />
      </Helmet>
      <EmployeeAppointconfigView />
    </ACLGuard>
  );
}
