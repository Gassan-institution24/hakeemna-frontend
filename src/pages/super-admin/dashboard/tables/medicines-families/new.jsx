import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/medFamilies/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Medicine Family</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
