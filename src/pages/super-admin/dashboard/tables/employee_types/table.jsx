import { Helmet } from 'react-helmet-async';

import {EmployeeTypesTableView} from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Unit Services Types Table</title>
      </Helmet>

      <EmployeeTypesTableView />
    </>
  );
}
