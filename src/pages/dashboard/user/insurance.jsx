import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { Insurance } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Insuranceinfo() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('insurance')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <Insurance />
    </>
  );
}
