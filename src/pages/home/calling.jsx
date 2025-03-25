import { Dialog } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import WebRTCComponent from 'src/components/vedio-call/webRTC';
import { useSearchParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function CallingPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const callerId = searchParams.get('caller');
  const userName = searchParams.get('userName');
  return (
    <>
      <Helmet>
        <title>
          Hakeemna 360 - Comprehensive medical platform : المنصة الطبية الشاملة - حكيمنا 360{' '}
        </title>
      </Helmet>

      <Dialog open fullScreen sx={{ display: 'flex', flexDirection: 'column' }}>
        <WebRTCComponent userId={userId} callerId={callerId} userName={userName} />
      </Dialog>
    </>
  );
}
