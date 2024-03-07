import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import WorkGroupHomeView from 'src/sections/unit-service/tables/work-groups/view/home';

// ----------------------------------------------------------------------

export default function WorkGroupHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>Work Groups</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkGroupHomeView />
    </ACLGuard>
  );
}
