import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import AppointmentEditView from 'src/sections/employee/appointments/view/edit';
// ----------------------------------------------------------------------

export default function AppointmentsEditPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="work_group" subcategory="appointments" acl="update">
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Edit Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentEditView />
    </ACLGuard>
  );
}
