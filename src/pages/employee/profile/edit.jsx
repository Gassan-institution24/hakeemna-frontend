import { Helmet } from 'react-helmet-async';

import EmployeeEditProfileView from 'src/sections/employee/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    // <ACLGuard category="employee" subcategory="info" acl="update">
    <>
      <Helmet>
        <title>Edit Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EmployeeEditProfileView />
    </>
    // </ACLGuard>
  );
}
