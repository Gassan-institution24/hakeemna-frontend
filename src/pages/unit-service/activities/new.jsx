import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import ActivityNewView from 'src/sections/unit-service/activities/view/new';

// ----------------------------------------------------------------------

export default function ActivityNewPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard permission="management_tables:create">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : New Activity</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ActivityNewView />
    </ACLGuard>
  );
}
