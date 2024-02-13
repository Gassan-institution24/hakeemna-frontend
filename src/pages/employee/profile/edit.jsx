import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeEditProfileView from 'src/sections/employee/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="info" acl="update">
        <Helmet>
          <title>Edit Profile</title>
        </Helmet>

        <EmployeeEditProfileView />
      </ACLGuard>
  );
}
