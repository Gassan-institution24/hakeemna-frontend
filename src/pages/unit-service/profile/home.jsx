import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import ProfileView from 'src/sections/unit-service/profile/view/home';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="update">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ProfileView />
    </ACLGuard>
  );
}
