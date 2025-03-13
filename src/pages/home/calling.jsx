import { Helmet } from 'react-helmet-async';

import WebRTCComponent from 'src/components/vedio-call/webRTC';

// ----------------------------------------------------------------------

export default function CallingPage() {
  return (
    <>
      <Helmet>
        <title>
          Hakeemna 360 - Comprehensive medical platform : المنصة الطبية الشاملة - حكيمنا 360{' '}
        </title>
      </Helmet>

      <WebRTCComponent />
    </>
  );
}
