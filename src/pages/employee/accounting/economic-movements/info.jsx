import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EconomicMovementInfoView from 'src/sections/employee/accounting/economic-movements/view/info';
// ----------------------------------------------------------------------

export default function EconomicMovementInfoPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="employee" subcategory="accounting" acl="update">
      <Helmet>
        <title> {user?.employee?.name_english} : Economic Movement Info</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementInfoView />
    </ACLGuard>
  );
}
