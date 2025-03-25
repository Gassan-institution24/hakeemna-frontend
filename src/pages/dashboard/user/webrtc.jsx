import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import WebRTCComponent from 'src/components/vedio-call/webRTC';
import { useSearchParams } from 'src/routes/hooks';
import { Dialog } from '@mui/material';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const callerId = searchParams.get('caller');
  const userName = searchParams.get('userName');

  return (
    <>
      <Helmet>
        <title> {t('Share')} </title>
        <meta name="description" content="meta" />
      </Helmet>
      <Dialog open fullScreen sx={{ display: 'flex', flexDirection: 'column' }}>
        <WebRTCComponent userId={userId} callerId={callerId} userName={userName} />
      </Dialog>
    </>
  );
}
