import { Helmet } from 'react-helmet-async';

import { OrdersListView } from 'src/sections/stakeholder/orders/view';

// ----------------------------------------------------------------------

export default function OrdersListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Orders List</title>
      </Helmet>

      <OrdersListView />
    </>
  );
}
