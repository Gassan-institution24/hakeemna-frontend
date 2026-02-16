import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/medical_analysis/medical_create';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Medical Analysis</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
