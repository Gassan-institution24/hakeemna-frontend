import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import WorkGroupHomeView from 'src/sections/employee/work-groups/view/home';

// ----------------------------------------------------------------------

export default function WorkGroupHomePage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Work Groups</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WorkGroupHomeView />
    </>
  );
}
