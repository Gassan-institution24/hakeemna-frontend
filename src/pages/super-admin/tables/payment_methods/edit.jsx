import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/payment_methods/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Payment Method</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
