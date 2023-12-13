import { Helmet } from 'react-helmet-async';

import UnitServiceCommunications from 'src/sections/unitservices/communications/communications';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> Unit Service Communications </title>
      </Helmet>

      <UnitServiceCommunications />
    </>
  );
}
