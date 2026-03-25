import { Helmet } from 'react-helmet-async';

import UserContactTableView from 'src/sections/super-admin/tables/view/userContact-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Free Subscriptions Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UserContactTableView />
    </>
  );
}
