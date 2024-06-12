import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { OfferEditView } from 'src/sections/stakeholder/offers/view';

// ----------------------------------------------------------------------

export default function OfferEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Offer Edit</title>
      </Helmet>

      <OfferEditView id={`${id}`} />
    </>
  );
}
