import { Helmet } from 'react-helmet-async';

import AnalysesTableView from 'src/sections/super-admin/tables/view/analyses-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Analyses Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <AnalysesTableView />
    </>
  );
}
