import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import WorkShiftHomeView from 'src/sections/unit-service/tables/work-shifts/view/home';

// ----------------------------------------------------------------------

export default function WorkShiftHomePage() {
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="work_shift" acl="read">
        <Helmet>
          <title>Work Shifts</title>
        </Helmet>

        <WorkShiftHomeView />
      </ACLGuard>
    </>
  );
}
