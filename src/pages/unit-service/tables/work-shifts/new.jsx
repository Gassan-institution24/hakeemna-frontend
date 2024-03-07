import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import WorkShiftNewView from 'src/sections/unit-service/tables/work-shifts/view/new';

// ----------------------------------------------------------------------

export default function WorkShiftNewPage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="create">
      <Helmet>
        <title>New Work Shift</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkShiftNewView />
    </ACLGuard>
  );
}
