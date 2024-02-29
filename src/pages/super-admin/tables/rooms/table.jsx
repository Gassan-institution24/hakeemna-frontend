import { Helmet } from 'react-helmet-async';

import { RoomsTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Rooms Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RoomsTableView />
    </>
  );
}
