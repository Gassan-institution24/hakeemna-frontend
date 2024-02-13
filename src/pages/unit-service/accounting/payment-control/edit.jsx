import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import PaymentControlEditView from 'src/sections/unit-service/accounting/payment-control/view/edit';
// ----------------------------------------------------------------------

export default function PaymentControlEditPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="accounting" acl="update">
        <Helmet>
          <title>Edit Payment Control</title>
        </Helmet>

        <PaymentControlEditView />
      </ACLGuard>
  );
}
