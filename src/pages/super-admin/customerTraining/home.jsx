import { Helmet } from 'react-helmet-async';

import CustomerTraining from 'src/sections/super-admin/customerTraining/view/home';

// ----------------------------------------------------------------------

export default function CustomerTrainingPage() {
  return (
    <>
      <Helmet>
        <title> Customer Training</title>
        <meta name="description" content="meta" />
      </Helmet>

      <CustomerTraining />
    </>
  );
}
