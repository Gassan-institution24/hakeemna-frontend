import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import FinancilMovmentInfo from 'src/sections/user/view/user-financilMovment-view-info';

// ----------------------------------------------------------------------

export default function FinancilMovmentInfoView() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Financial movement')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <FinancilMovmentInfo />
    </>
  );
}
