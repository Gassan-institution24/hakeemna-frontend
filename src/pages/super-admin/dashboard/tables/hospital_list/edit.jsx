import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/hospital_list/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Hospital</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
