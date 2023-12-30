import { Helmet } from 'react-helmet-async';

import FamiliesTableView from 'src/sections/super-admin/tables/view/medFamilies-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Medicine Families Table</title>
      </Helmet>

      <FamiliesTableView />
    </>
  );
}
