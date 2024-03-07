import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PaymentControlNewView from 'src/sections/employee/accounting/payment-control/view/new';
// ----------------------------------------------------------------------

export default function PaymentControlNewPage() {
  return (
    <ACLGuard category="employee" subcategory="accounting" acl="create">
      <Helmet>
        <title>New Payment Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PaymentControlNewView />
    </ACLGuard>
  );
}
