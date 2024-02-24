import { Helmet } from 'react-helmet-async';

import WorkGroupHomeView from 'src/sections/employee/work-groups/view/home';

// ----------------------------------------------------------------------

export default function WorkGroupHomePage() {
  return (
    <>
      <Helmet>
        <title>Work Groups</title>
      </Helmet>

      <WorkGroupHomeView />
    </>
  );
}
