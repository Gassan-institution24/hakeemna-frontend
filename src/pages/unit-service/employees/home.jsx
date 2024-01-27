import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeHomeView from 'src/sections/unit-service/employees/view/home';

// ----------------------------------------------------------------------

export default function EmployeeHomePage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="read">
        <Helmet>
          <title>Employees</title>
        </Helmet>

        <EmployeeHomeView />
      </ACLGuard>
    </>
  );
}
