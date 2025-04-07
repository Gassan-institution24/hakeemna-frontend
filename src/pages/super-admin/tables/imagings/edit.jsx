import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/imagings/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Imaging</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
