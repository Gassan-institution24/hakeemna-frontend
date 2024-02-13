import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ActivityNewView from 'src/sections/unit-service/activities/view/new';

// ----------------------------------------------------------------------

export default function ActivityNewPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="activities" acl="create">
        <Helmet>
          <title>New Activity</title>
        </Helmet>

        <ActivityNewView />
      </ACLGuard>
  );
}
