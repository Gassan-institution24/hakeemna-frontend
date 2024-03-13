import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PaymentControlEditView from 'src/sections/employee/accounting/payment-control/view/edit';
// ----------------------------------------------------------------------

export default function PaymentControlEditPage() {
  return (
    <ACLGuard category="employee" subcategory="accounting" acl="update">
      <Helmet>
        <title>Edit Payment Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PaymentControlEditView />
    </ACLGuard>
  );
}
