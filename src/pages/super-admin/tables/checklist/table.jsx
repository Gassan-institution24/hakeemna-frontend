import { Helmet } from 'react-helmet-async';

import { ChecklistTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: checklist Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ChecklistTableView />
    </>
  );
}
