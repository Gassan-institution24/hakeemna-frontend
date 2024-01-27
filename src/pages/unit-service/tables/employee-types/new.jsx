import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeTypeNewView from 'src/sections/unit-service/tables/employee-types/view/new';

// ----------------------------------------------------------------------

export default function EmployeeTypeNewPage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="create">
        <Helmet>
          <title>New Employee Type</title>
        </Helmet>

        <EmployeeTypeNewView />
      </ACLGuard>
    </>
  );
}
