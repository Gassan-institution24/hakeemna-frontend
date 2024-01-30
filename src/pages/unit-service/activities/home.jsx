import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import ActivitiesHomeView from 'src/sections/unit-service/activities/view/home';

// ----------------------------------------------------------------------

export default function ActivitiesHomePage() {
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="activities" acl="read">
        <Helmet>
          <title>Activities</title>
        </Helmet>

        <ActivitiesHomeView />
      </ACLGuard>
    </>
  );
}
