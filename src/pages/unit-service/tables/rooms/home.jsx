import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RoomHomeView from 'src/sections/unit-service/tables/rooms/view/home';

// ----------------------------------------------------------------------

export default function RoomHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="read">
      <Helmet>
        <title> Rooms</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RoomHomeView />
    </ACLGuard>
  );
}
