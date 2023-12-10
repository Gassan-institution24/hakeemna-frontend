import { Helmet } from 'react-helmet-async';

import AnalysesTableView from 'src/sections/tables/view/analyses-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Analyses Table</title>
      </Helmet>

      <AnalysesTableView />
    </>
  );
}
