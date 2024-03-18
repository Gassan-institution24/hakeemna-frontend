import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EconomicMovementNewView from 'src/sections/employee/accounting/economic-movements/view/new';
// ----------------------------------------------------------------------

export default function EconomicMovementNewPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="employee" subcategory="accounting" acl="create">
      <Helmet>
        <title> {user?.employee?.name_english} : New Economic Movement</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementNewView />
    </ACLGuard>
  );
}
