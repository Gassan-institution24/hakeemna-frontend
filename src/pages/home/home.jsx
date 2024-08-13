import { Helmet } from 'react-helmet-async';

import HomeView from 'src/sections/home/view/home-view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Hakeemna 360</title>
        <meta name="description" content="Hakeemna is an electronic health care system EHR provides ultimate services such as booking medical appointment and mangement of unit of service like hospitals and clinics in all field like accounting and entrance management" />
      </Helmet>

      <HomeView />
    </>
  );
}
