import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/medCategories/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Medical Category</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
