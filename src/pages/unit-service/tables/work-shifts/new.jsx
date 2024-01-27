import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import WorkShiftNewView from 'src/sections/unit-service/tables/work-shifts/view/new';

// ----------------------------------------------------------------------

export default function WorkShiftNewPage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="create">
        <Helmet>
          <title>New Work Shift</title>
        </Helmet>

        <WorkShiftNewView />
      </ACLGuard>
    </>
  );
}
