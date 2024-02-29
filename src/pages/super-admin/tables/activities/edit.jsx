import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/activities/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Activity</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
