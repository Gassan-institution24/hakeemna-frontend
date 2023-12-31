import { Helmet } from 'react-helmet-async';

import InsuranceHomeView from 'src/sections/unit-service/insurance/view/home';

// ----------------------------------------------------------------------

export default function InsuranceHomePage() {
  return (
    <>
      <Helmet>
        <title>Insurances</title>
      </Helmet>

      <InsuranceHomeView />
    </>
  );
}
