import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/payment_methods/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Payment Method</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
