import { Helmet } from 'react-helmet-async';

import FreeSubscriptionTableView from 'src/sections/super-admin/tables/view/freesubscriptions-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Free Subscriptions Table</title>
      </Helmet>

      <FreeSubscriptionTableView />
    </>
  );
}
