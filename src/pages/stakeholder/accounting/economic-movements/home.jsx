import { Helmet } from 'react-helmet-async';

import EconomicMovementView from 'src/sections/stakeholder/accounting/economic-movements/view/home';
// ----------------------------------------------------------------------

export default function EconomicMovementPage() {
  return (
    <>
      <Helmet>
        <title>Economic Movements</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementView />
    </>
  );
}
