import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import WorkGroupNewView from 'src/sections/unit-service/tables/work-groups/view/new';

// ----------------------------------------------------------------------

export default function WorkGroupNewPage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="create">
      <Helmet>
        <title>New Work Group</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkGroupNewView />
    </ACLGuard>
  );
}
