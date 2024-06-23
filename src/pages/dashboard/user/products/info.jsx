import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetOffer } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import OffersInfoView from 'src/sections/user/offers/view/info';

// ----------------------------------------------------------------------

export default function OffersInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetOffer(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="offers" acl="read">
      <Helmet>
        <title>{name || ''} Offer Info</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <OffersInfoView offerData={data} />}
    </ACLGuard>
  );
}
