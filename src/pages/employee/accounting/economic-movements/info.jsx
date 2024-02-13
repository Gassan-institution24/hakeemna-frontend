import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import EconomicMovementInfoView from 'src/sections/employee/accounting/economic-movements/view/info';
// ----------------------------------------------------------------------

export default function EconomicMovementInfoPage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="accounting" acl="update">
        <Helmet>
          <title>Economic Movement Info</title>
        </Helmet>

        <EconomicMovementInfoView />
      </ACLGuard>
  );
}
