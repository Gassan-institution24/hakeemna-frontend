import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { Share } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Share')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <Share />
    </>
  );
}
