import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/medicinesCategories/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Medicines Category</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
