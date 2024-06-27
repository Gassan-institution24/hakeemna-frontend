import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import PatientNewView from 'src/sections/unit-service/patients/view/new-patient';

// ----------------------------------------------------------------------

export default function PatientNewPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('new Patient')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <PatientNewView />
    </>
  );
}
