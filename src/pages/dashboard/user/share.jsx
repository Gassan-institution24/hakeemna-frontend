import { Helmet } from 'react-helmet-async';

import { Share } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  return (
    <>
      <Helmet>
        <title>Share</title>
      </Helmet>

      <Share />
    </>
  );
}
