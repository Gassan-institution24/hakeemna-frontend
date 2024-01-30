import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeNewView from 'src/sections/unit-service/employees/view/new';

// ----------------------------------------------------------------------

export default function EmployeeNewPage() {
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="employees" acl="create">
        <Helmet>
          <title>New Employee</title>
        </Helmet>

        <EmployeeNewView />
      </ACLGuard>
    </>
  );
}
