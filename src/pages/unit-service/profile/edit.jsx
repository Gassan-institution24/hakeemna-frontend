import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EditProfileView from 'src/sections/unit-service/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="update">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : Edit Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EditProfileView />
    </ACLGuard>
  );
}
