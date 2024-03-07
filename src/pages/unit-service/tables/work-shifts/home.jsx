import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import WorkShiftHomeView from 'src/sections/unit-service/tables/work-shifts/view/home';

// ----------------------------------------------------------------------

export default function WorkShiftHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>Work Shifts</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkShiftHomeView />
    </ACLGuard>
  );
}
