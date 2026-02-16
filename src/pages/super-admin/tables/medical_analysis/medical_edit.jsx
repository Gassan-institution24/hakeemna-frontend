import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/medical_analysis/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Medical Analysis</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
