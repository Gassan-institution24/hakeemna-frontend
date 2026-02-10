import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import VideoCall from 'src/sections/employee/patients/view/videoCall';

// ----------------------------------------------------------------------

export default function VideoCallPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Video Call')} </title>
        <meta name="description" content="meta" />
      </Helmet>
        <VideoCall />
    </>
  );
}
