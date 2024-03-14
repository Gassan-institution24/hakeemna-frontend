import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import WatingRoom from 'src/sections/user/waitingRoom';
// ----------------------------------------------------------------------

export default function Watingroomstatus() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('watingroom')}</title>
        <meta name="description" content="meta" />
      </Helmet>

      <WatingRoom />
    </>
  );
}
