import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeACLView from 'src/sections/unit-service/employees/view/acl';

// ----------------------------------------------------------------------

export default function EmployeeACLPage() {
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="update">
      <Helmet>
        <title>Access control list</title>
        <meta name="description" content="meta" />
      </Helmet>
      <EmployeeACLView />
    </ACLGuard>
  );
}
