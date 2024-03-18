import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkShiftNewView from 'src/sections/unit-service/tables/work-shifts/view/new';

// ----------------------------------------------------------------------

export default function WorkShiftNewPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="create">
      <Helmet>
        <title>{serviceUnitName} : New Work Shift</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkShiftNewView />
    </ACLGuard>
  );
}
