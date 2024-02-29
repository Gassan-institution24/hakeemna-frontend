import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/taxes/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Tax</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
