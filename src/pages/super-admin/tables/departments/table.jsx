import { Helmet } from 'react-helmet-async';

import DepartmentsTableView from 'src/sections/super-admin/tables/view/departments-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Departments Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <DepartmentsTableView />
    </>
  );
}
