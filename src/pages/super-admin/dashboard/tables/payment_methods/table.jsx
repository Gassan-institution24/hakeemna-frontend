import { Helmet } from 'react-helmet-async';

import { PaymentMethodsTableView } from 'src/sections/super-admin/tables/view/';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Payment Methods Table</title>
      </Helmet>

      <PaymentMethodsTableView />
    </>
  );
}
