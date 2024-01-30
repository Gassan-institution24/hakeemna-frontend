import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import AppointmentConfigHomeView from 'src/sections/unit-service/appointmentsConfiguration/view/home';

// ----------------------------------------------------------------------

export default function AppointmentConfigHomePage() {
  return (
    <>
    <ACLGuard hasContent category='unit_service' subcategory='appointment_configs' acl='read'>
      <Helmet>
        <title> Appointment Configurations</title>
      </Helmet>

       <AppointmentConfigHomeView />
       </ACLGuard>
    </>
  );
}
