import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/analyses/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Analysis</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
