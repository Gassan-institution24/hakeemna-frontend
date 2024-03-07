import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeTypeNewView from 'src/sections/unit-service/tables/employee-types/view/new';

// ----------------------------------------------------------------------

export default function EmployeeTypeNewPage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="create">
      <Helmet>
        <title>New Employee Type</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeTypeNewView />
    </ACLGuard>
  );
}
