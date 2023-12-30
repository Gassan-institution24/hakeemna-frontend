import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/taxes/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Tax</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
