import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import History from 'src/sections/user/view/history';

// ----------------------------------------------------------------------

export default function Historyy() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('history')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <History />
    </>
  );
}
