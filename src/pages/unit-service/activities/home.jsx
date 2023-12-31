import { Helmet } from 'react-helmet-async';

import ActivitiesHomeView from 'src/sections/unit-service/activities/view/home';

// ----------------------------------------------------------------------

export default function ActivitiesHomePage() {
  return (
    <>
      <Helmet>
        <title>Activities</title>
      </Helmet>

      <ActivitiesHomeView />
    </>
  );
}
