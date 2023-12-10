import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/diets/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Diet</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
