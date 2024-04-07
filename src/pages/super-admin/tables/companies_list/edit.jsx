import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/companies_list/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Company</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
