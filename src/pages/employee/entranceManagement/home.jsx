import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EntranceManagement from 'src/sections/employee/entranceManagement/view/home';
// ----------------------------------------------------------------------

export default function EntranceManagementHomePage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="entrance_management" acl="read">
      <Helmet>
        <title>Entrance Management</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EntranceManagement />
    </ACLGuard>
  );
}
