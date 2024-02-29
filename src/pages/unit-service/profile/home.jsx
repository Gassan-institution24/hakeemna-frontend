import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ProfileView from 'src/sections/unit-service/profile/view/home';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="unit_service_info" acl="update">
      <Helmet>
        <title>My Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ProfileView />
    </ACLGuard>
  );
}
