import { Helmet } from 'react-helmet-async';

import { InsuranceTypesTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: insurance types</title>
        <meta name="description" content="meta" />
      </Helmet>

      <InsuranceTypesTableView />
    </>
  );
}
