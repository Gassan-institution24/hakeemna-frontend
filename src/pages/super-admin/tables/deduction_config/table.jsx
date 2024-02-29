import { Helmet } from 'react-helmet-async';

import { DeductionConfigTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Deduction Config Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <DeductionConfigTableView />
    </>
  );
}
