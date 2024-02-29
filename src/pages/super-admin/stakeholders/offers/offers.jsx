import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import StakeholderOffers from 'src/sections/super-admin/stakeholders/offers/offers-home-page';
// ----------------------------------------------------------------------

export default function StackholderOffersPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Offers </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <StakeholderOffers stakeholderData={data} />}
    </>
  );
}
