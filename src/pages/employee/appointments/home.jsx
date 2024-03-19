import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import AppointmentHomeView from 'src/sections/employee/appointments/view/home';
// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="work_group" subcategory="appointments" acl="read">
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentHomeView />
    </ACLGuard>
  );
}
