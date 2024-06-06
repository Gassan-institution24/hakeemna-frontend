import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/family_relation/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new family relation</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
