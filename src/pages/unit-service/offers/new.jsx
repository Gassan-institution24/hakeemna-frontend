import { Helmet } from 'react-helmet-async';

import OfferNewView from 'src/sections/unit-service/offers/view/new';

// ----------------------------------------------------------------------

export default function OfferNewPage() {
  return (
    <>
      <Helmet>
        <title>New Offer</title>
      </Helmet>

      <OfferNewView />
    </>
  );
}
