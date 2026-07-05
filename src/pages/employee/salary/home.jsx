import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import MySalaryView from 'src/sections/employee/salary/view/home';

// ----------------------------------------------------------------------

export default function MySalaryPage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : My Salary</title>
        <meta name="description" content="meta" />
      </Helmet>

      <MySalaryView />
    </>
  );
}
