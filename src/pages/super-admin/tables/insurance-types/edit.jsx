import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/insurance_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit insurance type</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
