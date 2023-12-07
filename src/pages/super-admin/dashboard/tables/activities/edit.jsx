import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/activities/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Activity</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
