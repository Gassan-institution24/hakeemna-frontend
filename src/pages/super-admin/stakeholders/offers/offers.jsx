import { Helmet } from 'react-helmet-async';

import StakeholderOffers from 'src/sections/super-admin/stakeholders/offers/offers-home-page';
import { useGetStakeholder } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
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
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <StakeholderOffers stakeholderData={data} />}
    </>
  );
}
