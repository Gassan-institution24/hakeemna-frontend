import { Helmet } from 'react-helmet-async';

import CategoriesTableView from 'src/sections/tables/view/medCategories-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Medical Categories Table</title>
      </Helmet>

      <CategoriesTableView />
    </>
  );
}
