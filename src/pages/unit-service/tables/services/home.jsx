import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ServicesHomeView from 'src/sections/unit-service/tables/services/view/home';

// ----------------------------------------------------------------------

export default function ServicesHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title> services </title>
        <meta name="description" content="meta" />
      </Helmet>

      <ServicesHomeView />
    </ACLGuard>
  );
}
