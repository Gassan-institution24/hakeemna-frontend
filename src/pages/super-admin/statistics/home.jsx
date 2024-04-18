import { Helmet } from 'react-helmet-async';

import StatisticsPage from 'src/sections/super-admin/statistics/view/home';

// ----------------------------------------------------------------------

export default function StatisticsHomePage() {
  return (
    <>
      <Helmet>
        <title>Statistics</title>
        <meta name="description" content="meta" />
      </Helmet>

      <StatisticsPage />
    </>
  );
}
