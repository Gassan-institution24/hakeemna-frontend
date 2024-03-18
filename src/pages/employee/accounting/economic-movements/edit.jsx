import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import EconomicMovementEditView from 'src/sections/employee/accounting/economic-movements/view/edit';
// ----------------------------------------------------------------------

export default function EconomicMovementEditPage() {
  const { user } = useAuthContext();
  return (
    <ACLGuard category="employee" subcategory="accounting" acl="update">
      <Helmet>
        <title> {user?.employee?.name_english} : Edit Economic Movement</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementEditView />
    </ACLGuard>
  );
}
