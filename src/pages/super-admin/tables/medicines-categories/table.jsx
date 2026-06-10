import { Helmet } from 'react-helmet-async';

import MedicinesCategoriesTableView from 'src/sections/super-admin/tables/view/medicinesCategories-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Medicines Categories Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <MedicinesCategoriesTableView />
    </>
  );
}
