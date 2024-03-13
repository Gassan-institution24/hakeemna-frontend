import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RoomNewView from 'src/sections/unit-service/tables/rooms/view/new';

// ----------------------------------------------------------------------

export default function RoomNewPage() {
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="create">
      <Helmet>
        <title>New Room</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RoomNewView />
    </ACLGuard>
  );
}
