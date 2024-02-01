import { Helmet } from 'react-helmet-async';

import { TablesListView } from 'src/sections/super-admin/tables/view';

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
