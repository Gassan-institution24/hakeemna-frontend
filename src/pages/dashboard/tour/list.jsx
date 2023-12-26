import { Helmet } from 'react-helmet-async';

import { TourListView } from 'src/sections/unit-service-admin/tour/view';

// ----------------------------------------------------------------------

export default function TourListPage() {
  return (
    <>
      <Helmet>
        <title>List</title>
      </Helmet>

      <TourListView />
    </>
  );
}
