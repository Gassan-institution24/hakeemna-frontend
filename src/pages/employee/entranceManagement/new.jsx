import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import NewEntranceManagementView from 'src/sections/employee/entranceManagement/view/new';
// ----------------------------------------------------------------------

export default function EntranceManagementNewPage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="entrance_management" acl="create">
      <Helmet>
        <title>New Entrance Management</title>
        <meta name="description" content="meta" />
      </Helmet>

      <NewEntranceManagementView />
    </ACLGuard>
  );
}
