import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ServiceNewView from 'src/sections/unit-service/tables/services/view/new';

// ----------------------------------------------------------------------

export default function ServiceNewPage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="create">
      <Helmet>
        <title>New service</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ServiceNewView />
    </ACLGuard>
  );
}
