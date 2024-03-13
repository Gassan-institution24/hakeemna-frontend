import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EconomicMovementView from 'src/sections/unit-service/accounting/economic-movements/view/home';
// ----------------------------------------------------------------------

export default function EconomicMovementPage() {
  return (
    <ACLGuard category="unit_service" subcategory="accounting" acl="read">
      <Helmet>
        <title>Economic Movements</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementView />
    </ACLGuard>
  );
}
