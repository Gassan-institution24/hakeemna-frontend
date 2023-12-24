import { Helmet } from 'react-helmet-async';

import StakeholderOffers from 'src/sections/stakeholders/offers/offers-home-page';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StackholderOffersPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Offers </title>
      </Helmet>

      {data && <StakeholderOffers stakeholderData={data} />}
    </>
  );
}
