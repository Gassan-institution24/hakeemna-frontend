import { Helmet } from 'react-helmet-async';

import {TablesListView} from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TablesListPage() {
  return (
    <>
      <Helmet>
        <title> Super Admin: Tables List</title>
      </Helmet>

      <TablesListView />
    </>
  );
}
