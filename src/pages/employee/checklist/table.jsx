import { Helmet } from 'react-helmet-async';

import ChecklistTableView from 'src/sections/employee/checklist/view/checklist-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: my checklist</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ChecklistTableView />
    </>
  );
}
