import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/view/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new city</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
