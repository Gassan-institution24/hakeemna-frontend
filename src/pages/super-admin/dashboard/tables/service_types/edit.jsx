import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/service_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Service Type</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
