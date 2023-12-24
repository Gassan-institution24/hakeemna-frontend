import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/subspecialties/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Subspecialty</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
