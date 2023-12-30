import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/medCategories/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Medical Category</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
