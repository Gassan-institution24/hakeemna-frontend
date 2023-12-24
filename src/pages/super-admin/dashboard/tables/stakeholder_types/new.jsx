import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/stakeholder_types/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Stakeholder Type</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
