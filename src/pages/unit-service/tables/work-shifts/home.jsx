import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkShiftHomeView from 'src/sections/unit-service/tables/work-shifts/view/home';

// ----------------------------------------------------------------------

export default function WorkShiftHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>{serviceUnitName} : Work Shifts</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkShiftHomeView />
    </ACLGuard>
  );
}
