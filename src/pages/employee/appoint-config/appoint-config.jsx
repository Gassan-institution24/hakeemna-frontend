import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeAppointconfigView from 'src/sections/employee/appoint-config/view/appoint-config-table';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  return (
    <ACLGuard category="work_group" subcategory="appointment_configs" acl="read">
      <Helmet>
        <title> Appointment Config </title>
        <meta name="description" content="meta" />
      </Helmet>
      <EmployeeAppointconfigView />)
    </ACLGuard>
  );
}
