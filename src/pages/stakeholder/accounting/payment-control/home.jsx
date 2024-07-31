import { Helmet } from 'react-helmet-async';

import PaymentControlView from 'src/sections/stakeholder/accounting/payment-control/view/home';
// ----------------------------------------------------------------------

export default function PaymentControlPage() {
  return (
    <>
      <Helmet>
        <title>Payment Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PaymentControlView />
    </>
  );
}
