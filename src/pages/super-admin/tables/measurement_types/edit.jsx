import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/measurement_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Measurement Type</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
