import { Helmet } from 'react-helmet-async';

import RoomNewView from 'src/sections/unit-service/tables/rooms/view/new';

// ----------------------------------------------------------------------

export default function RoomNewPage() {
  return (
    <>
      <Helmet>
        <title>New Room</title>
      </Helmet>

      <RoomNewView />
    </>
  );
}
