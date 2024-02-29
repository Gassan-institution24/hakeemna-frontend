import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetOffer, useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import StakeholderOfferView from 'src/sections/super-admin/stakeholders/offers/offer-view/offer-view';
// ----------------------------------------------------------------------

export default function StackholderFeedbackPage() {
  const params = useParams();
  const { id, ofid } = params;
  const { data } = useGetStakeholder(id);
  const { offerData, loading } = useGetOffer(ofid);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Feedback </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <StakeholderOfferView stakeholderData={data} offerData={offerData} />}
    </>
  );
}
