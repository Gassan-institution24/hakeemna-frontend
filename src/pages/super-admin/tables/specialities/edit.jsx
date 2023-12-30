import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/specialties/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Specialty</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
