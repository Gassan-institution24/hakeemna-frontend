import { Helmet } from 'react-helmet-async';

import { StackholderTypesTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Stakeholder Types Table</title>
      </Helmet>

      <StackholderTypesTableView />
    </>
  );
}
