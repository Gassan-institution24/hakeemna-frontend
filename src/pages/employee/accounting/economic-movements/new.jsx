import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';
import EconomicMovementNewView from 'src/sections/employee/accounting/economic-movements/view/new'
// ----------------------------------------------------------------------

export default function EconomicMovementNewPage() {
  return (
    <>
    <ACLGuard hasContent category='employee' subcategory='accounting' acl='create' >
      <Helmet>
        <title>New Economic Movement</title>
      </Helmet>

      <EconomicMovementNewView />
      </ACLGuard>
    </>
  );
}
