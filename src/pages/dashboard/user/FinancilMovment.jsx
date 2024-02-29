import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { FinancilMovment } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function FinancilMovmentdoctorna() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Financial movements')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <FinancilMovment />
    </>
  );
}
