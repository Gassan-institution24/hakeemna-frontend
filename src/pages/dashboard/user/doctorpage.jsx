import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { Doctorpage } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Doctorpageinfo() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Doctorpage')} </title>
      </Helmet>

      <Doctorpage />
    </>
  );
}
