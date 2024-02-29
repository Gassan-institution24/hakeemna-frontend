import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/deduction_config/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Deduction Config</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
