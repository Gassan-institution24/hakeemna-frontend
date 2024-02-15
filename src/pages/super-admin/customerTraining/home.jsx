import { Helmet } from 'react-helmet-async';

import CustomerTraining from 'src/sections/super-admin/customerTraining/home';

// ----------------------------------------------------------------------

export default function CustomerTrainingPage() {
  return (
    <>
      <Helmet>
        <title> Customer Training</title>
      </Helmet>

      <CustomerTraining />
    </>
  );
}
