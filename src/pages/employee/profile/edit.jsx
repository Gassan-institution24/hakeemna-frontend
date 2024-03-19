import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import EmployeeEditProfileView from 'src/sections/employee/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  const { user } = useAuthContext();
  return (
    // <ACLGuard category="employee" subcategory="info" acl="update">
    <>
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Edit Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeEditProfileView />
    </>
    // </ACLGuard>
  );
}
