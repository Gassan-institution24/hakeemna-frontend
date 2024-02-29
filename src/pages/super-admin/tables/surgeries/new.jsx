import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/surgeries/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Surgery</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
