import { Helmet } from 'react-helmet-async';

import RoomHomeView from 'src/sections/unit-service/tables/rooms/view/home';

// ----------------------------------------------------------------------

export default function RoomHomePage() {
  return (
    <>
      <Helmet>
        <title> Rooms</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RoomHomeView />
    </>
  );
}
