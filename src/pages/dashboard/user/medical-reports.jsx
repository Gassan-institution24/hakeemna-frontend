import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { Medicalreports } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Medicalreport() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Medical Reports')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <Medicalreports />
    </>
  );
}
