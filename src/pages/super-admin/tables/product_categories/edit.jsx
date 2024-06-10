import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/product_category/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new product category</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
