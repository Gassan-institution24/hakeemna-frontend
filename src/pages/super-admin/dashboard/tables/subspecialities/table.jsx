import { Helmet } from 'react-helmet-async';

import SubSpecialtiesTableView from 'src/sections/tables/view/subspecialties-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Subspecialty Table</title>
      </Helmet>

      <SubSpecialtiesTableView />
    </>
  );
}
