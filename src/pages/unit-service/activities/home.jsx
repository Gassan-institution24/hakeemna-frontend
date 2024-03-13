import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ActivitiesHomeView from 'src/sections/unit-service/activities/view/home';

// ----------------------------------------------------------------------

export default function ActivitiesHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>Activities</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ActivitiesHomeView />
    </ACLGuard>
  );
}
