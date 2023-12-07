import { Helmet } from 'react-helmet-async';

import SpecialtiesTableView from 'src/sections/tables/view/specialities-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Specialties Table</title>
      </Helmet>

      <SpecialtiesTableView />
    </>
  );
}
