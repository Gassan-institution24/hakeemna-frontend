import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { Radiology } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function RadiologyPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Radiology')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <Radiology />
    </>
  );
}
