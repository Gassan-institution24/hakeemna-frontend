import { Helmet } from 'react-helmet-async';
import HomeViewus from 'src/sections/home/view/home-view-us'
import HomeView from 'src/sections/home/view/home-view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Doctorna</title>
      </Helmet>

      {/* <HomeView /> */}
      <HomeView />

    </>
  );
}


// {<HomeViewPatient /> ? (
//   <Helmet>
//     <title>Doctorna patients</title>
//   </Helmet>
// ) : (
//   <Helmet>
//     <title>Doctorna</title>
//   </Helmet>
// )}