import { Helmet } from 'react-helmet-async';

import WorkShiftHomeView from 'src/sections/unit-service/tables/work-shifts/view/home';

// ----------------------------------------------------------------------

export default function WorkShiftHomePage() {
  return (
    <>
      <Helmet>
        <title>Work Shifts</title>
      </Helmet>

      <WorkShiftHomeView />
    </>
  );
}
