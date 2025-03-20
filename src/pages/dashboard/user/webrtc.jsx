import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import WebRTCComponent from 'src/components/vedio-call/webRTC';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Share')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <WebRTCComponent />
    </>
  );
}
