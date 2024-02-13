import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EconomicMovementEditView from 'src/sections/unit-service/accounting/economic-movements/view/edit';
// ----------------------------------------------------------------------

export default function EconomicMovementEditPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="accounting" acl="update">
        <Helmet>
          <title>Edit Economic Movement</title>
        </Helmet>

        <EconomicMovementEditView />
      </ACLGuard>
  );
}
