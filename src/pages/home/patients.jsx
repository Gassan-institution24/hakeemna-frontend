import { Helmet } from 'react-helmet-async';

import Patients from 'src/sections/home/view/patients';
// ----------------------------------------------------------------------

export default function patients() {
  return (
    <>
      <Helmet>
        <title>Hakeemna 360 - منصة حكيمنا الطبية : Beneficiaries</title>
        <meta name="description" content="meta" />
      </Helmet>

      <Patients />
    </>
  );
}
