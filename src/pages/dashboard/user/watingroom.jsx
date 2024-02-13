import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import WatingRoom from 'src/sections/user/watingRoom';
// ----------------------------------------------------------------------

export default function Watingroomstatus() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('watingroom')}</title>
      </Helmet>

      <WatingRoom />
    </>
  );
}
