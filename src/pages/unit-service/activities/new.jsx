import { Helmet } from 'react-helmet-async';

import ActivityNewView from 'src/sections/unit-service/activities/view/new';

// ----------------------------------------------------------------------

export default function ActivityNewPage() {
  return (
    <>
      <Helmet>
        <title>New Activity</title>
      </Helmet>

      <ActivityNewView />
    </>
  );
}
