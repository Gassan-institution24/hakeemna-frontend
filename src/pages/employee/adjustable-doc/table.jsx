import { Helmet } from 'react-helmet-async';

import AdjustableTableView from 'src/sections/employee/adjustable-doc/view/adjustable-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: my adjustable document</title>
        <meta name="description" content="meta" />
      </Helmet>

      <AdjustableTableView />
    </>
  );
}
