import { Helmet } from 'react-helmet-async';

import ComingSoonView from 'src/sections/other/coming-soon/view';

// ----------------------------------------------------------------------

export default function ComingSoonPage() {
  return (
    <>
      <Helmet>
        <title> Coming Soon</title>
      </Helmet>

      <ComingSoonView />
    </>
  );
}
