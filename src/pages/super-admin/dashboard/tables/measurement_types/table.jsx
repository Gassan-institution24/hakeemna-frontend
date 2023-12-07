import { Helmet } from 'react-helmet-async';

import MeasurmentTypesTableView from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Measurment Types Table</title>
      </Helmet>

      <MeasurmentTypesTableView />
    </>
  );
}
