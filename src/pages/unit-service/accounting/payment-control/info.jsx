import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PaymentControlInfoView from 'src/sections/unit-service/accounting/payment-control/view/info';
// ----------------------------------------------------------------------

export default function PaymentControlInfoPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="accounting" acl="read">
      <Helmet>
        <title>Payment Control Info</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PaymentControlInfoView />
    </ACLGuard>
  );
}
