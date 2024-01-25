import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import AppointconfigDetailView from 'src/sections/employee/appoint-config/view/appoint-config-detail';

// ----------------------------------------------------------------------

export default function NewEmployeeAppointconfigPage() {
  return (
    <>
    <ACLGuard hasContent category='appointment_config' acl='create'>
      <Helmet>
        <title> New Appointment Config</title>
      </Helmet>

        <AppointconfigDetailView/>
        </ACLGuard>
    </>
  );
}
