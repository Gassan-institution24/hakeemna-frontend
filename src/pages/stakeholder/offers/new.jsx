import { Helmet } from 'react-helmet-async';

import { OfferCreateView } from 'src/sections/stakeholder/offers/view';

// ----------------------------------------------------------------------

export default function OfferCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new offer</title>
      </Helmet>

      <OfferCreateView />
    </>
  );
}
