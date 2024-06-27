import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import OffersHomeView from 'src/sections/user/offers/view/all-products';

// ----------------------------------------------------------------------

export default function OffersHomePage() {
  const { user } = useAuthContext();
  const patientName = user?.patient.name_english;
  return (
    <>
      <Helmet>
        <title>{patientName || 'patient'} : Products </title>
        <meta name="description" content="meta" />
      </Helmet>

      <OffersHomeView />
    </>
  );
}
