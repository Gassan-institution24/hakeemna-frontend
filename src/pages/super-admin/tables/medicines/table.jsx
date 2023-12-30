import { Helmet } from 'react-helmet-async';

import MedicinesTableView from 'src/sections/super-admin/tables/view/medicines-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Medicines Table</title>
      </Helmet>

      <MedicinesTableView />
    </>
  );
}
