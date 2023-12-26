import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/unitservices/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Unit Service</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
