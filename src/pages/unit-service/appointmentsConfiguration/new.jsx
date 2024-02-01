import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import AppointmentConfigNewView from 'src/sections/unit-service/appointmentsConfiguration/view/new';

// ----------------------------------------------------------------------

export default function AppointmentConfigNewPage() {
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="appointment_configs" acl="create">
        <Helmet>
          <title>New Appointment Configurations</title>
        </Helmet>

        <AppointmentConfigNewView />
      </ACLGuard>
    </>
  );
}
