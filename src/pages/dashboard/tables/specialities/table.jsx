import { Helmet } from 'react-helmet-async';

import SpecialtiesTableView from 'src/sections/super-admin/tables/view/specialities-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Specialties Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SpecialtiesTableView />
    </>
  );
}
