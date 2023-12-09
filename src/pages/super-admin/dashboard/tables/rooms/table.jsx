import { Helmet } from 'react-helmet-async';

import {RoomsTableView} from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Rooms Table</title>
      </Helmet>

      <RoomsTableView />
    </>
  );
}
