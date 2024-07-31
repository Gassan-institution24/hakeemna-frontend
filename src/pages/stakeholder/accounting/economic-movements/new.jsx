import { Helmet } from 'react-helmet-async';

import EconomicMovementNewView from 'src/sections/stakeholder/accounting/economic-movements/view/new';
// ----------------------------------------------------------------------

export default function EconomicMovementNewPage() {
  return (
    <>
      <Helmet>
        <title>New Economic Movement</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementNewView />
    </>
  );
}
