import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/freeSubscriptions/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Free Subscription</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
