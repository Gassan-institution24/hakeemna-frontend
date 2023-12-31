import { Helmet } from 'react-helmet-async';

import WorkShiftNewView from 'src/sections/unit-service/tables/work-shifts/view/new';

// ----------------------------------------------------------------------

export default function WorkShiftNewPage() {
  return (
    <>
      <Helmet>
        <title>New Work Shift</title>
      </Helmet>

      <WorkShiftNewView />
    </>
  );
}
