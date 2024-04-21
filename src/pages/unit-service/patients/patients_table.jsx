import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import PatientsView from 'src/sections/unit-service/patients/view/patients';

// ----------------------------------------------------------------------

export default function PatientsPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Patients')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <PatientsView />
    </>
  );
}
