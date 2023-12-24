import { Helmet } from 'react-helmet-async';

import StakeholderOfferView from 'src/sections/stakeholders/offers/offer-view/offer-view';
import { useGetStakeholder,useGetOffer } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StackholderFeedbackPage() {
  const params = useParams();
  const { id,ofid } = params;
  const { data } = useGetStakeholder(id);
  const { offerData } = useGetOffer(ofid);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Feedback </title>
      </Helmet>

      {data && <StakeholderOfferView stakeholderData={data} offerData={offerData}/>}
    </>
  );
}
