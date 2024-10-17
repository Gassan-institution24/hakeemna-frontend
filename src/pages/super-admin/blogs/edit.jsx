import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/blogs/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : Edit Blogs</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
