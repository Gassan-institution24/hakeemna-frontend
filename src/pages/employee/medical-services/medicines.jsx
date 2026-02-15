import { Helmet } from 'react-helmet-async';

import Medicines from 'src/sections/employee/medical-services/medicines';

// ----------------------------------------------------------------------

export default function medicinesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medicines</title>
        <meta name="description" content="meta" />
      </Helmet>
      <Medicines />
    </>
  );
}
