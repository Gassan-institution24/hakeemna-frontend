import { Helmet } from 'react-helmet-async';

import  OverviewAppView  from 'src/sections/user/homePage/view/home';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
