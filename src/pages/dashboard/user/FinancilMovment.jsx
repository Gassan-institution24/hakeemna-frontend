import { Helmet } from 'react-helmet-async';

import { FinancilMovment } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function FinancilMovmentdoctorna() {
  return (
    <>
      <Helmet>
        <title>Share</title>
      </Helmet>

      <FinancilMovment />
    </>
  );
}
