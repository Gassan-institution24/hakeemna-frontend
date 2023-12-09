import { Helmet } from 'react-helmet-async';

import {HospitalsTableView} from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Hospitals Table</title>
      </Helmet>

      <HospitalsTableView />
    </>
  );
}
