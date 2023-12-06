import { Helmet } from 'react-helmet-async';

import DepartmentsTableView from 'src/sections/tables/view/departments-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Departments Table</title>
      </Helmet>

      <DepartmentsTableView />
    </>
  );
}
