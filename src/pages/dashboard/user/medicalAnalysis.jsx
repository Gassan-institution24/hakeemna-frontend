import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { MedicalAnalysis } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function MedicalAnalysisPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Medical Reports')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <MedicalAnalysis />
    </>
  );
}
