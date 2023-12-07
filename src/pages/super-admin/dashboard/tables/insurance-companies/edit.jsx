import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/insuranceCompanies/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Insurance Company</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
