import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/service_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Service Type</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
