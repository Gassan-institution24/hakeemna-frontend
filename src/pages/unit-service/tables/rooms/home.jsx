import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import RoomHomeView from 'src/sections/unit-service/tables/rooms/view/home';

// ----------------------------------------------------------------------

export default function RoomHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Rooms</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RoomHomeView />
    </ACLGuard>
  );
}
