import { Helmet } from 'react-helmet-async';

import ConfirmingView from 'src/sections/super-admin/confirming/view/confirming-view';

// ----------------------------------------------------------------------

export default function ConfirmingPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna : confirming</title>
        <meta name="description" content="meta" />
      </Helmet>
      <ConfirmingView />
    </>
  );
}
