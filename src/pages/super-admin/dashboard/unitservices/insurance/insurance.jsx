import { Helmet } from 'react-helmet-async';

import UnitServiceInsurance from 'src/sections/unitservices/insurance/insurance';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> Unit Service Insurance </title>
      </Helmet>

      <UnitServiceInsurance />
    </>
  );
}
