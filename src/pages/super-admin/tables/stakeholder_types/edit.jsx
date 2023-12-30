import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/stakeholder_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Stackholder Type</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
