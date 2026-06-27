import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PaymentControlView from 'src/sections/unit-service/accounting/payment-control/view/home';
// ----------------------------------------------------------------------

export default function PaymentControlPage() {
  return (
    <ACLGuard permission="accounting:read">
      <Helmet>
        <title>Payment Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PaymentControlView />
    </ACLGuard>
  );
}
