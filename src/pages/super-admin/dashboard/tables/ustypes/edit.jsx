import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/ustypes/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Unit Service Type</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
