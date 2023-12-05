import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/symptoms/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Symptom</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
