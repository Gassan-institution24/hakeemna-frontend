import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/deduction_config/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Deduction Config</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
