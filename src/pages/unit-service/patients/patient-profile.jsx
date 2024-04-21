import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import PatientProfileView from 'src/sections/unit-service/patients/view/patient_profile';

// ----------------------------------------------------------------------

export default function PatientProfilePage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Patient profile')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <PatientProfileView />
    </>
  );
}
