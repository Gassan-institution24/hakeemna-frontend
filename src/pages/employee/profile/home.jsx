import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import EmployeeProfileView from 'src/sections/employee/profile/view/home';

// ----------------------------------------------------------------------

export default function EmployeeProfilePage() {
  const { user } = useAuthContext();
  return (
    // <ACLGuard category="employee" subcategory="info" acl="read">
    <>
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : My Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeProfileView />
    </>
    // </ACLGuard>
  );
}
