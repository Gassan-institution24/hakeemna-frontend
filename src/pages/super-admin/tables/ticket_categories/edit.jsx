import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/ticket_categories/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit ticket category</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
