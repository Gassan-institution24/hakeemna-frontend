import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/medicines/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Medicine</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
