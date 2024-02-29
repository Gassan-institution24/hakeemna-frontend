import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeProfileView from 'src/sections/employee/profile/view/home';

// ----------------------------------------------------------------------

export default function EmployeeProfilePage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="info" acl="read">
      <Helmet>
        <title>My Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeProfileView />
    </ACLGuard>
  );
}
