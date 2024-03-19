import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import AppointmentsHomeView from 'src/sections/unit-service/appointments/view/home';

// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="appointments" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentsHomeView />
    </ACLGuard>
  );
}
