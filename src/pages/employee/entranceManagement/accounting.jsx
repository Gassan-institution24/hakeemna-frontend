import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EntranceManagementACC from 'src/sections/employee/entranceManagement/view/accounting';
// ----------------------------------------------------------------------

export default function EntranceManagementAccPage() {
  return (
    <ACLGuard category="work_group" subcategory="entrance_management" acl="read">
      <Helmet>
        <title>Entrance Management Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EntranceManagementACC />
    </ACLGuard>
  );
}
