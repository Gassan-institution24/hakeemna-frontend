import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';
import EconomicMovementInfoView from 'src/sections/unit-service/accounting/economic-movements/view/info'
// ----------------------------------------------------------------------

export default function EconomicMovementInfoPage() {
  return (
    <>
    <ACLGuard hasContent category='accounting' acl='read'>
      <Helmet>
        <title>Economic Movement Info</title>
      </Helmet>

      <EconomicMovementInfoView />
      </ACLGuard>
    </>
  );
}
