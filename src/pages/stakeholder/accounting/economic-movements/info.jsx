import { Helmet } from 'react-helmet-async';

import EconomicMovementInfoView from 'src/sections/stakeholder/accounting/economic-movements/view/info';
// ----------------------------------------------------------------------

export default function EconomicMovementInfoPage() {
  return (
    <>
      <Helmet>
        <title>Economic Movement Info</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementInfoView />
    </>
  );
}
