import { Helmet } from 'react-helmet-async';

import {DeductionConfigTableView} from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Deduction Config Table</title>
      </Helmet>

      <DeductionConfigTableView />
    </>
  );
}
