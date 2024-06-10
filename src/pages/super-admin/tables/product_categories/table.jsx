import { Helmet } from 'react-helmet-async';

import ProductCateoriesTableView from 'src/sections/super-admin/tables/view/productCat-table-view ';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: product category Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ProductCateoriesTableView />
    </>
  );
}
