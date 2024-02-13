import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeTypeHomeView from 'src/sections/unit-service/tables/employee-types/view/home';

// ----------------------------------------------------------------------

export default function EmployeeTypeHomePage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="employee_type" acl="read">
      <Helmet>
        <title>Employee Types</title>
      </Helmet>

      <EmployeeTypeHomeView />
    </ACLGuard>
  );
}
