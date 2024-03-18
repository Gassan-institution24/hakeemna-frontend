import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EconomicMovementView from 'src/sections/employee/accounting/economic-movements/view/home';
// ----------------------------------------------------------------------

export default function EconomicMovementPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="employee" subcategory="accounting" acl="read">
      <Helmet>
        <title> {user?.employee?.name_english} : Economic Movements</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementView />
    </ACLGuard>
  );
}
