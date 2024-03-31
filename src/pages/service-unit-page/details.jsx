import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import TourDetailsView from 'src/sections/home/service-unit-page/view/tour-details-view';

// ----------------------------------------------------------------------

export default function TourDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Analytics</title>
      </Helmet>

      <TourDetailsView id={`${id}`} />
    </>
  );
}
