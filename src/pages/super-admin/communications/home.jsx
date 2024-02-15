import { Helmet } from 'react-helmet-async';

import Communication from 'src/sections/super-admin/communication/home';

// ----------------------------------------------------------------------

export default function CommunicationPage() {
  return (
    <>
      <Helmet>
        <title> Communications</title>
      </Helmet>

      <Communication />
    </>
  );
}
