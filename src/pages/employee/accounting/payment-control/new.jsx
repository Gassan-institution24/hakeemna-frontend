import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PaymentControlNewView from 'src/sections/employee/accounting/payment-control/view/new';
// ----------------------------------------------------------------------

export default function PaymentControlNewPage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="accounting" acl="create">
      <Helmet>
        <title>New Payment Control</title>
      </Helmet>

      <PaymentControlNewView />
    </ACLGuard>
  );
}
