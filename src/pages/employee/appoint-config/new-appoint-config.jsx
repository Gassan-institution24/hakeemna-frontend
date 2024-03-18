import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import AppointconfigDetailView from 'src/sections/employee/appoint-config/view/appoint-config-detail';

// ----------------------------------------------------------------------

export default function NewEmployeeAppointconfigPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="work_group" subcategory="appointment_configs" acl="create">
      <Helmet>
        <title> {user?.employee?.name_english} : New Appointment Config</title>
        <meta name="description" content="meta" />
      </Helmet>

      <AppointconfigDetailView />
    </ACLGuard>
  );
}
