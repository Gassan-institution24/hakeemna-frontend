import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/medFamilies/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Medicine Family</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
