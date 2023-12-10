import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/surgeries/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit One Surgery</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
