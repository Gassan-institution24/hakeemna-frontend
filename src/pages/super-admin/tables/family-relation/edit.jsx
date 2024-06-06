import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/family_relation/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit family relation</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
