import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/insuranceCompanies/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Insurance Company</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
