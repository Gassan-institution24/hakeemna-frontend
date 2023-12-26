import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/rooms/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Room</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
