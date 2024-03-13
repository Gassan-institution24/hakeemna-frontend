import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EditProfileView from 'src/sections/unit-service/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="update">
      <Helmet>
        <title>Edit Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EditProfileView />
    </ACLGuard>
  );
}
