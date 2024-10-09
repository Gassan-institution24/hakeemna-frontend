import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/Blog_category/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Blog category</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
