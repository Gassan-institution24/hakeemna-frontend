import { Helmet } from 'react-helmet-async';

import EconomicMovementEditView from 'src/sections/stakeholder/accounting/economic-movements/view/edit';
// ----------------------------------------------------------------------

export default function EconomicMovementEditPage() {
  return (
    <>
      <Helmet>
        <title>Edit Economic Movement</title>
        <meta name="description" content="meta" />
      </Helmet>

      <EconomicMovementEditView />
    </>
  );
}
