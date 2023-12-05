import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/diseases/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Disease</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
