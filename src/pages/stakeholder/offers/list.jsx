import { Helmet } from 'react-helmet-async';

import { OfferListView } from 'src/sections/stakeholder/offers/view';

// ----------------------------------------------------------------------

export default function OfferListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Offers List</title>
      </Helmet>

      <OfferListView />
    </>
  );
}
