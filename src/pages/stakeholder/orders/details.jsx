import { Helmet } from 'react-helmet-async';
// import { useGetOrder } from 'src/api';
// import { useParams } from 'src/routes/hooks';

import { OrderDetailsView } from 'src/sections/stakeholder/orders/view';

// ----------------------------------------------------------------------

export default function OrdersListPage() {
  // const { id } = useParams()
  // const { orderData } = useGetOrder(id)
  return (
    <>
      <Helmet>
        <title> Dashboard: Order details</title>
      </Helmet>

      <OrderDetailsView />
    </>
  );
}
