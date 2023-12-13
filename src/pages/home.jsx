import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';
import HomeViewPatient from 'src/sections/home/view/home-view-patients';
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Doctorna</title>
      </Helmet>

      <HomeView />
    </>
  );
}
