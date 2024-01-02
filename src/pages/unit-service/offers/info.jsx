import { Helmet } from 'react-helmet-async';

import OffersInfoView from 'src/sections/unit-service/offers/view/info';
import { useGetOffer } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function OffersInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetOffer(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Offer Info</title>
      </Helmet>

      {data && <OffersInfoView offerData={data} />}
    </>
  );
}
