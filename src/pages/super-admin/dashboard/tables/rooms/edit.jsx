import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/rooms/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Room</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
