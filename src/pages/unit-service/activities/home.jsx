import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import ActivitiesHomeView from 'src/sections/unit-service/activities/view/home';

// ----------------------------------------------------------------------

export default function ActivitiesHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>{serviceUnitName} : Activities</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ActivitiesHomeView />
    </ACLGuard>
  );
}
