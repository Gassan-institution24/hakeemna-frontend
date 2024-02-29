import { Helmet } from 'react-helmet-async';

import SubSpecialtiesTableView from 'src/sections/super-admin/tables/view/subspecialties-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Subspecialty Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubSpecialtiesTableView />
    </>
  );
}
