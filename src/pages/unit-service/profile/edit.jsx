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
    <ACLGuard permission="unit_service_info:update">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Edit Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EditProfileView />
    </ACLGuard>
  );
}
